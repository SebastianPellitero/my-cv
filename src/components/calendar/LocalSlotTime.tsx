"use client";
import { useSyncExternalStore } from "react";

type Props = {
    start: string;
    end: string;
    // The timezone the slot is listed in, to detect a visitor who is already in it
    timezone: string;
};

const subscribe = () => () => {};
const getVisitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
// Renders nothing on the server, so SSR output can't disagree with the browser
const getServerZone = () => null;

function formatRange(start: string, end: string, timeZone: string) {
    // Fixed locale so the text matches the page's language and 24-hour Amsterdam times
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        timeZone,
    }).formatRange(new Date(start), new Date(end));
}

export default function LocalSlotTime({ start, end, timezone }: Props) {
    const zone = useSyncExternalStore(subscribe, getVisitorZone, getServerZone);
    if (!zone) return null;

    const local = formatRange(start, end, zone);
    const isSame = local === formatRange(start, end, timezone);

    return (
        <div>
            <dt className="font-mono text-xs tracking-[0.1em] uppercase text-zinc-600 dark:text-zinc-400">
                Your time ({zone.replaceAll("_", " ")})
            </dt>
            <dd className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {isSame ? "Same as Amsterdam time" : local}
            </dd>
        </div>
    );
}
