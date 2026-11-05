import { describe, expect, it } from "vitest"
import { parseCalendarInput, parseStoredCalendar } from "./schema"

const stored = {
    id: "3f2b8c1e-7a4d-4e6f-9b1a-2c3d4e5f6a7b",
    title: "Sebastian's availability for Coolblue",
    timezone: "Europe/Amsterdam",
    createdAt: "2026-11-05T12:00:00.000Z",
    expiresAt: "2026-11-19T12:00:00.000Z",
    slots: [{ start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" }],
}

describe("parseStoredCalendar", () => {
    it("accepts a valid record", () => {
        expect(parseStoredCalendar(stored)?.id).toBe(stored.id)
    })

    it("treats a missing key as expired", () => {
        expect(parseStoredCalendar(null)).toBeNull()
    })

    it("treats malformed JSON shapes as expired", () => {
        expect(parseStoredCalendar({ ...stored, slots: [] })).toBeNull()
        expect(parseStoredCalendar({ ...stored, timezone: "UTC" })).toBeNull()
        expect(parseStoredCalendar("not a calendar")).toBeNull()
    })
})

describe("parseCalendarInput", () => {
    const now = new Date("2026-11-05T12:00:00.000Z")
    const slot = { date: "2026-11-10", start: "10:00", end: "11:00" }

    it("converts Amsterdam input to UTC", () => {
        const result = parseCalendarInput({ title: " Coolblue ", note: "", slots: [slot] }, now)

        expect(result).toEqual({
            ok: true,
            data: {
                title: "Coolblue",
                note: undefined,
                slots: [{ start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" }],
            },
        })
    })

    it("reports a missing title and bad slot fields by path", () => {
        const result = parseCalendarInput({ title: "", slots: [{ ...slot, date: "" }] }, now)

        expect(result).toEqual({
            ok: false,
            fieldErrors: { title: "Enter a title.", "slots.0.date": "Enter a date." },
        })
    })

    it("rejects an end time that isn't after the start", () => {
        const result = parseCalendarInput({ title: "x", slots: [{ ...slot, end: "10:00" }] }, now)
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.end": "End time must be after the start time." },
        })
    })

    it("rejects slots in the past", () => {
        const result = parseCalendarInput({ title: "x", slots: [{ ...slot, date: "2026-11-01" }] }, now)
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.start": "This slot must be in the future." },
        })
    })

    it("rejects a time skipped by DST", () => {
        const result = parseCalendarInput(
            { title: "x", slots: [{ date: "2027-03-28", start: "02:30", end: "03:30" }] },
            now
        )
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.start": "That time doesn't exist on this date." },
        })
    })

    it("rejects a list with no slots", () => {
        const result = parseCalendarInput({ title: "x", slots: [] }, now)
        expect(result).toEqual({ ok: false, fieldErrors: { slots: "Add at least one slot." } })
    })
})
