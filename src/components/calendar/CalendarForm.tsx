"use client";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { createCalendarLink, type CreateLinkState } from "@/app/admin/calendar/actions";
import CopyButton from "./CopyButton";
import { card, errorText, field, fieldLabel, primaryButton, secondaryButton } from "./styles";

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

export default function CalendarForm({ origin }: { origin: string }) {
    const baseId = useId();
    const [state, formAction, pending] = useActionState(createCalendarLink, initialState);

    // Controlled so React's post-action form reset can't wipe the fields after a validation error
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [slots, setSlots] = useState<SlotRow[]>([{ key: 0, date: "", start: "", end: "" }]);
    const [announcement, setAnnouncement] = useState("");

    // Errors point at positions in the list as submitted, which may shift when rows are removed
    const [submittedKeys, setSubmittedKeys] = useState<number[]>([]);

    const formRef = useRef<HTMLFormElement>(null);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const nextKey = useRef(1);
    const pendingFocusId = useRef<string | null>(null);

    const errors = state.status === "error" ? state.fieldErrors : {};
    const formError = errors.form ?? errors.slots;

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
        // A new row usually shares the previous slot's day
        const date = slots[slots.length - 1]?.date ?? "";
        setSlots((rows) => [...rows, { key, date, start: "", end: "" }]);
        pendingFocusId.current = slotInputId(key, "date");
    }

    function removeSlot(key: number, position: number) {
        setSlots((rows) => rows.filter((row) => row.key !== key));
        setAnnouncement(`Slot ${position} removed`);
        addButtonRef.current?.focus();
    }

    function submit() {
        setSubmittedKeys(slots.map((row) => row.key));
        formAction({
            title,
            note,
            slots: slots.map(({ date, start, end }) => ({ date, start, end })),
        });
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
                Create a link
            </h2>

            <form ref={formRef} action={submit} noValidate className="grid gap-6">
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

                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    Enter slot times in Amsterdam time.
                </p>

                {slots.map((row, position) => (
                    <fieldset key={row.key} className={card}>
                        <legend className="px-2 font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal">
                            Slot {position + 1}
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
                        {slots.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeSlot(row.key, position + 1)}
                                className={`${secondaryButton} mt-4`}
                            >
                                Remove<span className="sr-only"> slot {position + 1}</span>
                            </button>
                        )}
                    </fieldset>
                ))}

                <div className="flex flex-wrap items-center gap-3">
                    <button ref={addButtonRef} type="button" onClick={addSlot} className={secondaryButton}>
                        Add slot
                    </button>
                    <button type="submit" disabled={pending} className={primaryButton}>
                        {pending ? "Creating" : "Create link"}
                    </button>
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
