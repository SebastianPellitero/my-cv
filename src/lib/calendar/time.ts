import { formatInTimeZone, fromZonedTime } from "date-fns-tz"

export const CALENDAR_TIMEZONE = "Europe/Amsterdam"

export type CalendarSlot = { start: string; end: string }

// Returns null for values that don't exist, including times skipped by the spring DST change
export function amsterdamToUtc(date: string, time: string): Date | null {
    const local = `${date}T${time}:00`
    const utc = fromZonedTime(local, CALENDAR_TIMEZONE)
    if (Number.isNaN(utc.getTime())) return null
    return formatInTimeZone(utc, CALENDAR_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss") === local ? utc : null
}

// Time left over at the end of a range is dropped, since a full slot doesn't fit in it
export function splitIntoSlots(start: Date, end: Date, slotMinutes: number): CalendarSlot[] {
    const slots: CalendarSlot[] = []
    const length = slotMinutes * 60_000

    for (let at = start.getTime(); at + length <= end.getTime(); at += length) {
        slots.push({ start: new Date(at).toISOString(), end: new Date(at + length).toISOString() })
    }

    return slots
}

export function formatDay(iso: string): string {
    return formatInTimeZone(iso, CALENDAR_TIMEZONE, "EEEE d MMMM")
}

export function formatTime(iso: string): string {
    return formatInTimeZone(iso, CALENDAR_TIMEZONE, "HH:mm")
}

export function formatExpiry(iso: string): string {
    return formatInTimeZone(iso, CALENDAR_TIMEZONE, "d MMMM yyyy, HH:mm")
}

export function formatSlot(slot: CalendarSlot): string {
    return `${formatDay(slot.start)}, ${formatTime(slot.start)} to ${formatTime(slot.end)}`
}

export type SlotDay = {
    key: string
    label: string
    // index is the slot's position in the stored list, used to address its .ics file
    slots: { slot: CalendarSlot; index: number }[]
}

export function groupSlotsByDay(slots: CalendarSlot[]): SlotDay[] {
    const days = new Map<string, SlotDay>()

    const sorted = slots
        .map((slot, index) => ({ slot, index }))
        .sort((a, b) => a.slot.start.localeCompare(b.slot.start))

    for (const entry of sorted) {
        const key = formatInTimeZone(entry.slot.start, CALENDAR_TIMEZONE, "yyyy-MM-dd")
        const day = days.get(key) ?? { key, label: formatDay(entry.slot.start), slots: [] }
        day.slots.push(entry)
        days.set(key, day)
    }

    return [...days.values()]
}
