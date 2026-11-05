import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalSlotTime from "@/components/calendar/LocalSlotTime";
import { card, primaryButton, secondaryButton } from "@/components/calendar/styles";
import { buildPickSlotMailto } from "@/lib/calendar/mailto";
import { getCalendar } from "@/lib/calendar/store";
import {
    CALENDAR_TIMEZONE,
    formatExpiry,
    formatSlot,
    formatTime,
    groupSlotsByDay,
    type CalendarSlot,
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

function SlotItem({
    id,
    slot,
    index,
    contactEmail,
}: {
    id: string;
    slot: CalendarSlot;
    index: number;
    contactEmail: string;
}) {
    const label = formatSlot(slot);

    return (
        <li className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
            {/* min-height holds the space LocalSlotTime fills in after hydration */}
            <dl className="grid flex-1 gap-3 min-h-28 sm:min-h-12 sm:grid-cols-2">
                <div>
                    <dt className="font-mono text-xs tracking-[0.1em] uppercase text-zinc-600 dark:text-zinc-400">
                        Amsterdam time
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                        {formatTime(slot.start)} – {formatTime(slot.end)}
                    </dd>
                </div>
                <LocalSlotTime start={slot.start} end={slot.end} timezone={CALENDAR_TIMEZONE} />
            </dl>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:shrink-0">
                <a
                    href={buildPickSlotMailto(contactEmail, label, CALENDAR_TIMEZONE)}
                    aria-label={`Pick this slot: ${label}`}
                    className={primaryButton}
                >
                    Pick this slot
                </a>
                <a
                    href={`/calendar/${id}/slot/${index}`}
                    download
                    aria-label={`Add to calendar: ${label}`}
                    className={secondaryButton}
                >
                    Add to calendar
                </a>
            </div>
        </li>
    );
}

export default async function CalendarPage({ params }: Props) {
    const { id } = await params;
    const calendar = await getCalendar(id);
    if (!calendar) notFound();

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) throw new Error("CONTACT_EMAIL is not set");

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

            {groupSlotsByDay(calendar.slots).map((day) => (
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
                        {day.slots.map(({ slot, index }) => (
                            <SlotItem key={index} id={calendar.id} slot={slot} index={index} contactEmail={contactEmail} />
                        ))}
                    </ul>
                </section>
            ))}

            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                Link valid until {formatExpiry(calendar.expiresAt)} (Amsterdam time)
            </p>
        </div>
    );
}
