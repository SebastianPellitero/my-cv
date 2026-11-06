import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SlotPicker from "@/components/calendar/SlotPicker";
import { inlineLink } from "@/components/calendar/styles";
import { getCalendar, getPick } from "@/lib/calendar/store";
import {
    CALENDAR_TIMEZONE,
    formatExpiry,
    formatSlot,
    formatTime,
    getSlotMinutes,
    groupSlotsByDay,
} from "@/lib/calendar/time";

// Expiry only works if every request reads Redis
export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ id: string }>;
};

const robots = { index: false, follow: false };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const calendar = await getCalendar(id);

    if (!calendar) {
        return {
            title: { absolute: "This link has expired" },
            description: "This link is no longer available.",
            robots,
        };
    }

    const description = "Interview availability";
    return {
        title: { absolute: calendar.title },
        description,
        robots,
        openGraph: { type: "website", title: calendar.title, description },
    };
}

export default async function CalendarPage({ params }: Props) {
    const { id } = await params;
    const calendar = await getCalendar(id);
    if (!calendar) notFound();

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) throw new Error("CONTACT_EMAIL is not set");

    const pick = await getPick(calendar.id);

    const days = groupSlotsByDay(calendar.slots).map((day) => ({
        key: day.key,
        label: day.label,
        slots: day.slots.map(({ slot, index }) => ({
            index,
            label: formatSlot(slot),
            time: formatTime(slot.start),
            endTime: formatTime(slot.end),
            start: slot.start,
        })),
    }));

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block w-6 h-px bg-teal" />
                    <span className="text-xs tracking-[0.2em] uppercase font-mono text-teal-ink dark:text-teal">
                        Interview availability
                    </span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-4">
                    {calendar.title}
                </h1>
                <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                    Sebastian Pellitero, Senior Frontend Developer
                </p>
                {calendar.note && (
                    <p className="mt-4 font-mono text-sm leading-relaxed max-w-xl text-zinc-700 dark:text-zinc-300">
                        {calendar.note}
                    </p>
                )}
            </header>

            <noscript>
                <p className="mb-8 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    To pick a slot, please email{" "}
                    <a href={`mailto:${contactEmail}`} className={inlineLink}>
                        {contactEmail}
                    </a>
                </p>
            </noscript>

            <SlotPicker
                id={calendar.id}
                days={days}
                pickedIndex={pick?.slotIndex ?? null}
                slotMinutes={getSlotMinutes(calendar.slots)}
                timezone={CALENDAR_TIMEZONE}
                contactEmail={contactEmail}
            />

            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                Link valid until {formatExpiry(calendar.expiresAt)} (Amsterdam time)
            </p>
        </div>
    );
}
