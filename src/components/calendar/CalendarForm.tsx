"use client";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createCalendarLink, type CreateLinkState } from "@/app/admin/calendar/actions";
import CopyButton from "./CopyButton";
import { card, errorText, field, fieldLabel, focusRing, primaryButton, secondaryButton } from "./styles";

type SlotField = "date" | "start" | "end";
type SlotRow = Record<SlotField, string> & { key: number };

const initialState: CreateLinkState = { status: "idle" };

const slotFields: { name: SlotField; label: string; type: "date" | "time" }[] = [
    { name: "date", label: "Date", type: "date" },
    { name: "start", label: "Start time", type: "time" },
    { name: "end", label: "End time", type: "time" },
];

type FieldProps = {
    id: string;
    label: string;
    value: string;
    error?: string;
    type?: string;
    multiline?: boolean;
    onChange: (value: string) => void;
};

function Field({ id, label, value, error, type = "text", multiline = false, onChange }: FieldProps) {
    const errorId = `${id}-error`;
    const shared = {
        id,
        value,
        className: field,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
    };

    return (
        <div>
            <label htmlFor={id} className={fieldLabel}>
                {label}
            </label>
            {multiline ? (
                <textarea {...shared} rows={2} onChange={(event) => onChange(event.target.value)} />
            ) : (
                <input {...shared} type={type} onChange={(event) => onChange(event.target.value)} />
            )}
            {error && (
                <p id={errorId} className={`mt-1 ${errorText}`}>
                    Error: {error}
                </p>
            )}
        </div>
    );
}

type EditTarget = {
    action: (state: CreateLinkState, input: unknown) => Promise<CreateLinkState>;
    title: string;
    note: string;
    slotMinutes: number;
    currentSlots: string[];
};

type Props = {
    origin?: string;
    edit?: EditTarget;
};

export default function CalendarForm({ origin, edit }: Props) {
    const baseId = useId();
    const [state, formAction, pending] = useActionState(edit?.action ?? createCalendarLink, initialState);

    const [title, setTitle] = useState(edit?.title ?? "");
    const [note, setNote] = useState(edit?.note ?? "");
    const [halfHour, setHalfHour] = useState(false);
    // An edit can change just the text, so it starts with no ranges
    const [slots, setSlots] = useState<SlotRow[]>(edit ? [] : [{ key: 0, date: "", start: "", end: "" }]);
    const [announcement, setAnnouncement] = useState("");

    // Errors point at positions in the list as submitted, which may shift when rows are removed
    const [submittedKeys, setSubmittedKeys] = useState<number[]>([]);

    const formRef = useRef<HTMLFormElement>(null);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const nextKey = useRef(1);
    const pendingFocusId = useRef<string | null>(null);

    const errors = state.status === "error" ? state.fieldErrors : {};
    const formError = errors.form ?? errors.slots;
    const slotMinutes = edit?.slotMinutes ?? (halfHour ? 30 : 60);

    const slotInputId = (key: number, name: SlotField) => `${baseId}-slot-${key}-${name}`;

    function slotError(key: number, name: SlotField) {
        const index = submittedKeys.indexOf(key);
        return index === -1 ? undefined : errors[`slots.${index}.${name}`];
    }

    function updateSlot(key: number, name: SlotField, value: string) {
        setSlots((rows) => rows.map((row) => (row.key === key ? { ...row, [name]: value } : row)));
    }

    function addSlot() {
        const key = nextKey.current++;
        // A new row usually shares the previous range's day
        const date = slots[slots.length - 1]?.date ?? "";
        setSlots((rows) => [...rows, { key, date, start: "", end: "" }]);
        pendingFocusId.current = slotInputId(key, "date");
    }

    function removeSlot(key: number, position: number) {
        setSlots((rows) => rows.filter((row) => row.key !== key));
        setAnnouncement(`Range ${position} removed`);
        addButtonRef.current?.focus();
    }

    // Submits through onSubmit because a form action resets the form, which unticks the checkbox after an error
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmittedKeys(slots.map((row) => row.key));
        startTransition(() =>
            formAction({
                title,
                note,
                slotMinutes,
                slots: slots.map(({ date, start, end }) => ({ date, start, end })),
            })
        );
    }

    useEffect(() => {
        if (!pendingFocusId.current) return;
        document.getElementById(pendingFocusId.current)?.focus();
        pendingFocusId.current = null;
    }, [slots]);

    useEffect(() => {
        if (state.status !== "error") return;
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }, [state]);

    const url = state.status === "success" ? `${origin}/calendar/${state.id}` : null;

    return (
        <section aria-labelledby="create-link-heading" className="mb-12">
            <h2
                id="create-link-heading"
                className="mb-4 font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal"
            >
                {edit ? "Link details" : "Create a link"}
            </h2>

            <form ref={formRef} onSubmit={submit} noValidate className="grid gap-6">
                <Field
                    id={`${baseId}-title`}
                    label="Title"
                    value={title}
                    error={errors.title}
                    onChange={setTitle}
                />
                <Field
                    id={`${baseId}-note`}
                    label="Note (optional)"
                    value={note}
                    error={errors.note}
                    multiline
                    onChange={setNote}
                />

                {edit ? (
                    <div>
                        <p className={fieldLabel}>Current slots</p>
                        <ul className="grid gap-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                            {edit.currentSlots.map((label) => (
                                <li key={label}>{label}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <label className="flex cursor-pointer items-center gap-3 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                        <input
                            type="checkbox"
                            checked={halfHour}
                            onChange={(event) => setHalfHour(event.target.checked)}
                            className={`h-5 w-5 shrink-0 cursor-pointer accent-teal-ink dark:accent-teal ${focusRing}`}
                        />
                        The appointment is only 30 minutes
                    </label>
                )}

                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {edit ? "Add more ranges" : "Enter ranges"} in Amsterdam time. Each one is shown to the visitor as{" "}
                    {slotMinutes === 30 ? "30-minute" : "1-hour"} slots.
                </p>

                {slots.map((row, position) => (
                    <fieldset key={row.key} className={card}>
                        <legend className="px-2 font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal">
                            Range {position + 1}
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {slotFields.map(({ name, label, type }) => (
                                <Field
                                    key={name}
                                    id={slotInputId(row.key, name)}
                                    label={label}
                                    type={type}
                                    value={row[name]}
                                    error={slotError(row.key, name)}
                                    onChange={(value) => updateSlot(row.key, name, value)}
                                />
                            ))}
                        </div>
                        {(edit || slots.length > 1) && (
                            <button
                                type="button"
                                onClick={() => removeSlot(row.key, position + 1)}
                                className={`${secondaryButton} mt-4`}
                            >
                                Remove<span className="sr-only"> range {position + 1}</span>
                            </button>
                        )}
                    </fieldset>
                ))}

                <div className="flex flex-wrap items-center gap-3">
                    <button ref={addButtonRef} type="button" onClick={addSlot} className={secondaryButton}>
                        Add range
                    </button>
                    <button type="submit" disabled={pending} className={primaryButton}>
                        {edit ? (pending ? "Saving" : "Save changes") : pending ? "Creating" : "Create link"}
                    </button>
                    {edit && (
                        <Link href="/admin/calendar" className={secondaryButton}>
                            Cancel
                        </Link>
                    )}
                </div>

                <div role="alert">{formError && <p className={errorText}>Error: {formError}</p>}</div>
            </form>

            <p role="status" className="sr-only">
                {announcement}
            </p>

            {/* Stays mounted so screen readers announce the result when it appears */}
            <div role="status" className="mt-6">
                {url && state.status === "success" && (
                    <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                        Link created, valid until {state.expiresLabel} (Amsterdam time).
                    </p>
                )}
            </div>
            {url && (
                <div className="mt-2 grid gap-2">
                    <code className="font-mono text-sm break-all text-zinc-700 dark:text-zinc-300">{url}</code>
                    <div>
                        <CopyButton text={url} label="new link" />
                    </div>
                </div>
            )}
        </section>
    );
}
