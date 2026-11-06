"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { pickSlot } from "@/app/calendar/[id]/actions";
import {
    card,
    currentSlot,
    errorText,
    focusRing,
    inlineLink,
    primaryButton,
    secondaryButton,
    selectedSlotButton,
    slotButton,
} from "./styles";
import { formatVisitorTime, isSameTime, useVisitorZone } from "./VisitorTime";

export type PickerSlot = {
    index: number;
    label: string;
    time: string;
    endTime: string;
    start: string;
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
    slotMinutes: number;
    // The timezone the slots are listed in, to detect a visitor who is already in it
    timezone: string;
    contactEmail: string;
};

const confirmationId = "pick-confirmation";
const changeIntroId = "pick-change-intro";

const smallLabel = "font-mono text-xs tracking-[0.1em] uppercase text-zinc-600 dark:text-zinc-400";

export default function SlotPicker({ id, days, pickedIndex, slotMinutes, timezone, contactEmail }: Props) {
    const router = useRouter();
    const zone = useVisitorZone();
    const [changing, setChanging] = useState(false);
    const [confirming, setConfirming] = useState<number | null>(null);
    const [problem, setProblem] = useState<"limited" | "error" | null>(null);
    const [pending, startTransition] = useTransition();
    const pendingFocusId = useRef<string | null>(null);

    const allSlots = days.flatMap((day) => day.slots);
    const picked = allSlots.find((slot) => slot.index === pickedIndex);
    const showLocalTimes = zone !== null && !allSlots.every((slot) => isSameTime(slot.start, zone, timezone));

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

            <div className="mb-8">
                {/* min-height holds the space the visitor's zone fills in after hydration */}
                <div className="min-h-12">
                    {zone ? (
                        <>
                            <p className={smallLabel}>Your time ({zone.replaceAll("_", " ")})</p>
                            <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                {showLocalTimes ? "Shown under each Amsterdam time" : "Same as Amsterdam time"}
                            </p>
                        </>
                    ) : (
                        <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">Times are in Amsterdam time</p>
                    )}
                </div>
                <p className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    Each slot lasts {slotMinutes === 30 ? "30 minutes" : "1 hour"}.
                </p>
            </div>

            {days.map((day) => {
                const confirmingSlot = day.slots.find((slot) => slot.index === confirming);

                return (
                    <section key={day.key} aria-labelledby={`day-${day.key}`} className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block w-4 h-px bg-teal" />
                            <h2
                                id={`day-${day.key}`}
                                className="font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal"
                            >
                                {day.label}
                            </h2>
                        </div>
                        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                            {day.slots.map((slot) => {
                                const local = showLocalTimes && formatVisitorTime(slot.start, zone, timezone);
                                const isConfirming = slot.index === confirming;

                                return (
                                    <li key={slot.index}>
                                        {slot.index === pickedIndex ? (
                                            <div className={currentSlot}>
                                                <span>{slot.time}</span>
                                                <span className="text-xs">Current pick</span>
                                            </div>
                                        ) : (
                                            <button
                                                id={`pick-${slot.index}`}
                                                type="button"
                                                disabled={pending}
                                                aria-pressed={isConfirming}
                                                onClick={() => openConfirm(slot)}
                                                className={isConfirming ? selectedSlotButton : slotButton}
                                            >
                                                <span className="sr-only">Pick this slot: {day.label}, </span>
                                                <span>{slot.time}</span>
                                                <span className="sr-only">
                                                    {" "}
                                                    to {slot.endTime}
                                                    {local && ", your time "}
                                                </span>
                                                {local && <span className="text-xs">{local}</span>}
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {confirmingSlot && (
                            <div className={`${card} mt-3 flex flex-wrap items-center gap-3`}>
                                <p className="w-full font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                    Confirm {confirmingSlot.label}?
                                </p>
                                <button
                                    id={`confirm-${confirmingSlot.index}`}
                                    type="button"
                                    disabled={pending}
                                    aria-label={`Confirm: ${confirmingSlot.label}`}
                                    onClick={() => confirm(confirmingSlot)}
                                    className={primaryButton}
                                >
                                    {pending ? "Sending" : "Confirm"}
                                </button>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() => cancelConfirm(confirmingSlot)}
                                    className={secondaryButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </section>
                );
            })}
        </>
    );
}
