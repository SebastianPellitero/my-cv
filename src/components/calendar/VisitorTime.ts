"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getVisitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
// Nothing on the server, so SSR output can't disagree with the browser
const getServerZone = () => null;

export function useVisitorZone() {
    return useSyncExternalStore(subscribe, getVisitorZone, getServerZone);
}

const clock = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } as const;

function format(iso: string, timeZone: string, options: Intl.DateTimeFormatOptions) {
    // Fixed locale so the text matches the page's language and 24-hour Amsterdam times
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone }).format(new Date(iso));
}

export function isSameTime(iso: string, zone: string, listedZone: string) {
    return format(iso, zone, clock) === format(iso, listedZone, clock);
}

// Names the day only when it isn't the day the slot is listed under
export function formatVisitorTime(iso: string, zone: string, listedZone: string) {
    const time = format(iso, zone, clock);
    const day = format(iso, zone, { weekday: "short" });

    return day === format(iso, listedZone, { weekday: "short" }) ? time : `${day} ${time}`;
}
