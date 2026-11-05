import type { CalendarSlot } from "./time"

const encoder = new TextEncoder()

function escapeText(value: string): string {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n")
}

// RFC 5545 limits content lines to 75 octets, with continuations starting with a space
function foldLine(line: string): string {
    const parts: string[] = []
    let current = ""
    let octets = 0

    for (const char of line) {
        const size = encoder.encode(char).length
        const limit = parts.length === 0 ? 75 : 74
        if (octets + size > limit) {
            parts.push(current)
            current = ""
            octets = 0
        }
        current += char
        octets += size
    }

    parts.push(current)
    return parts.join("\r\n ")
}

// 2026-11-10T09:00:00.000Z -> 20261110T090000Z
function formatUtc(iso: string): string {
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

type SlotEvent = {
    uid: string
    summary: string
    slot: CalendarSlot
    stamp: Date
}

export function buildSlotIcs({ uid, summary, slot, stamp }: SlotEvent): string {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//sebastianpellitero.dev//Availability//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${formatUtc(stamp.toISOString())}`,
        `DTSTART:${formatUtc(slot.start)}`,
        `DTEND:${formatUtc(slot.end)}`,
        `SUMMARY:${escapeText(summary)}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ]

    return lines.map(foldLine).join("\r\n") + "\r\n"
}
