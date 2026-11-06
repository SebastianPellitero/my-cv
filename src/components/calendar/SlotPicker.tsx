"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { pickSlot } from "@/app/calendar/[id]/actions";
import LocalSlotTime from "./LocalSlotTime";
import { card, errorText, focusRing, inlineLink, primaryButton, secondaryButton } from "./styles";

export type PickerSlot = {
    index: number;
    label: string;
    timeRange: string;
    start: string;
    end: string;
};

export type PickerDay = {
    key: string;
    label: string;
    slots: PickerSlot[];
};

type Props = {
    id: string;
    days: PickerDay[];
    pickedIndex: number | null;
    timezone: string;
    contactEmail: string;
};

const confirmationId = "pick-confirmation";
const changeIntroId = "pick-change-intro";

const smallLabel = "font-mono text-xs tracking-[0.1em] uppercase text-zinc-600 dark:text-zinc-400";

export default function SlotPicker({ id, days, pickedIndex, timezone, contactEmail }: Props) {
    const router = useRouter();
    const [changing, setChanging] = useState(false);
    const [confirming, setConfirming] = useState<number | null>(null);
    const [problem, setProblem] = useState<"limited" | "error" | null>(null);
    const [pending, startTransition] = useTransition();
    const pendingFocusId = useRef<string | null>(null);

    const allSlots = days.flatMap((day) => day.slots);
    const picked = allSlots.find((slot) => slot.index === pickedIndex);

    // Each step replaces the focused control, so focus moves to what took its place.
    // After a pick the target arrives with the server's update, a render or two later.
    useEffect(() => {
        const target = pendingFocusId.current && document.getElementById(pendingFocusId.current);
        if (!target) return;
        target.focus();
        pendingFocusId.current = null;
    });

    function moveFocusTo(elementId: string) {
        pendingFocusId.current = elementId;
    }

    function openConfirm(slot: PickerSlot) {
        setProblem(null);
        setConfirming(slot.index);
        moveFocusTo(`confirm-${slot.index}`);
    }

    function cancelConfirm(slot: PickerSlot) {
        setConfirming(null);
        moveFocusTo(`pick-${slot.index}`);
    }

    function startChanging() {
        setChanging(true);
        moveFocusTo(changeIntroId);
    }

    function keepCurrentPick() {
        setChanging(false);
        setConfirming(null);
        setProblem(null);
        moveFocusTo(confirmationId);
    }

    function confirm(slot: PickerSlot) {
        setProblem(null);
        startTransition(async () => {
            const { status } = await pickSlot(id, slot.index).catch(() => ({ status: "error" as const }));

            if (status === "ok") {
                setChanging(false);
                setConfirming(null);
                moveFocusTo(confirmationId);
            } else if (status === "expired") {
                router.refresh();
            } else {
                setProblem(status);
            }
        });
    }

    if (picked && !changing) {
        return (
            <section aria-labelledby={confirmationId} className={`${card} mb-10 grid gap-4`}>
                <h2
                    id={confirmationId}
                    tabIndex={-1}
                    className={`font-serif text-2xl leading-tight text-zinc-900 dark:text-zinc-100 ${focusRing}`}
                >
                    Thanks, Sebastian will confirm by email
                </h2>
                <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    Your pick: {picked.label} (Amsterdam time)
                </p>
                <div>
                    <a
                        href={`/calendar/${id}/slot/${picked.index}`}
                        download
                        aria-label={`Add to calendar: ${picked.label}`}
                        className={secondaryButton}
                    >
                        Add to calendar
                    </a>
                </div>
                <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                    Need to change the time?{" "}
                    <button type="button" onClick={startChanging} className={`cursor-pointer ${inlineLink}`}>
                        Click here
                    </button>
                </p>
            </section>
        );
    }

    return (
        <>
            {picked && (
                <div className="mb-8 grid justify-items-start gap-3">
                    <p
                        id={changeIntroId}
                        tabIndex={-1}
                        className={`font-mono text-sm text-zinc-700 dark:text-zinc-300 ${focusRing}`}
                    >
                        Your current pick is {picked.label}. Choose another slot, or keep this one.
                    </p>
                    <button type="button" onClick={keepCurrentPick} className={secondaryButton}>
                        Keep my current pick
                    </button>
                </div>
            )}

            <div role="alert" className="mb-4">
                {problem && (
                    <p className={errorText}>
                        {problem === "limited"
                            ? "Too many changes for now. Please email "
                            : "Your pick wasn't saved. Please try again, or email "}
                        <a href={`mailto:${contactEmail}`} className={inlineLink}>
                            {contactEmail}
                        </a>
                    </p>
                )}
            </div>

            {days.map((day) => (
                <section key={day.key} aria-labelledby={`day-${day.key}`} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block w-4 h-px bg-teal" />
                        <h2
                            id={`day-${day.key}`}
                            className="font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal"
                        >
                            {day.label}
                        </h2>
                    </div>
                    <ul className="grid gap-4">
                        {day.slots.map((slot) => {
                            const isCurrent = slot.index === pickedIndex;
                            const isConfirming = slot.index === confirming;

                            return (
                                <li key={slot.index} className={`${card} grid gap-4`}>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        {/* min-height holds the space LocalSlotTime fills in after hydration */}
                                        <dl className="grid flex-1 gap-3 min-h-28 sm:min-h-12 sm:grid-cols-2">
                                            <div>
                                                <dt className={smallLabel}>Amsterdam time</dt>
                                                <dd className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                                    {slot.timeRange}
                                                </dd>
                                            </div>
                                            <LocalSlotTime start={slot.start} end={slot.end} timezone={timezone} />
                                        </dl>
                                        <div className="flex flex-wrap gap-2 sm:flex-col sm:shrink-0">
                                            {isCurrent ? (
                                                <p className={`${smallLabel} py-3`}>Your current pick</p>
                                            ) : (
                                                !isConfirming && (
                                                    <button
                                                        id={`pick-${slot.index}`}
                                                        type="button"
                                                        disabled={pending}
                                                        aria-label={`Pick this slot: ${slot.label}`}
                                                        onClick={() => openConfirm(slot)}
                                                        className={primaryButton}
                                                    >
                                                        Pick this slot
                                                    </button>
                                                )
                                            )}
                                            <a
                                                href={`/calendar/${id}/slot/${slot.index}`}
                                                download
                                                aria-label={`Add to calendar: ${slot.label}`}
                                                className={secondaryButton}
                                            >
                                                Add to calendar
                                            </a>
                                        </div>
                                    </div>

                                    {isConfirming && (
                                        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                                            <p className="w-full font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                                Confirm {slot.label}?
                                            </p>
                                            <button
                                                id={`confirm-${slot.index}`}
                                                type="button"
                                                disabled={pending}
                                                aria-label={`Confirm: ${slot.label}`}
                                                onClick={() => confirm(slot)}
                                                className={primaryButton}
                                            >
                                                {pending ? "Sending" : "Confirm"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() => cancelConfirm(slot)}
                                                className={secondaryButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </>
    );
}
