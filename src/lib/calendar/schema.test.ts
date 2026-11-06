import { describe, expect, it } from "vitest"
import { parseCalendarEdit, parseCalendarInput, parseStoredCalendar } from "./schema"

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

    it("splits a range into 1-hour slots", () => {
        const result = parseCalendarInput({ title: "x", slots: [{ ...slot, end: "13:00" }] }, now)

        expect(result.ok && result.data.slots).toEqual([
            { start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" },
            { start: "2026-11-10T10:00:00.000Z", end: "2026-11-10T11:00:00.000Z" },
            { start: "2026-11-10T11:00:00.000Z", end: "2026-11-10T12:00:00.000Z" },
        ])
    })

    it("splits a range into half hours when asked", () => {
        const result = parseCalendarInput({ title: "x", slotMinutes: 30, slots: [slot] }, now)

        expect(result.ok && result.data.slots).toEqual([
            { start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T09:30:00.000Z" },
            { start: "2026-11-10T09:30:00.000Z", end: "2026-11-10T10:00:00.000Z" },
        ])
    })

    it("rejects any other slot length", () => {
        const result = parseCalendarInput({ title: "x", slotMinutes: 1, slots: [slot] }, now)
        expect(result.ok).toBe(false)
    })

    it("rejects a range shorter than half an hour on a half-hour link", () => {
        const result = parseCalendarInput(
            { title: "x", slotMinutes: 30, slots: [{ ...slot, end: "10:15" }] },
            now
        )
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.end": "A range must be at least 30 minutes long." },
        })
    })

    it("rejects a range shorter than an hour", () => {
        const result = parseCalendarInput({ title: "x", slots: [{ ...slot, end: "10:30" }] }, now)
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.end": "A range must be at least 1 hour long." },
        })
    })

    it("rejects overlapping ranges", () => {
        const result = parseCalendarInput(
            { title: "x", slots: [{ ...slot, end: "12:00" }, { ...slot, start: "11:00", end: "13:00" }] },
            now
        )
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.1.start": "This range overlaps another one." },
        })
    })

    it("allows a range that starts when the previous one ends", () => {
        const result = parseCalendarInput(
            { title: "x", slots: [slot, { ...slot, start: "11:00", end: "12:00" }] },
            now
        )
        expect(result.ok && result.data.slots).toHaveLength(2)
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
            fieldErrors: { "slots.0.start": "This range must be in the future." },
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
        expect(result).toEqual({ ok: false, fieldErrors: { slots: "Add at least one range." } })
    })
})

describe("parseCalendarEdit", () => {
    const now = new Date("2026-11-05T12:00:00.000Z")
    const calendar = parseStoredCalendar(stored)!
    const range = { date: "2026-11-10", start: "14:00", end: "16:00" }

    it("changes the text and keeps the slots when no ranges are added", () => {
        const result = parseCalendarEdit({ title: " Coolblue ", note: "Fixed typo", slots: [] }, calendar, now)

        expect(result).toEqual({
            ok: true,
            data: { title: "Coolblue", note: "Fixed typo", slots: calendar.slots },
        })
    })

    it("clears the note when it's emptied", () => {
        const result = parseCalendarEdit({ title: "x", note: "", slots: [] }, { ...calendar, note: "Old" }, now)
        expect(result.ok && result.data.note).toBeUndefined()
    })

    it("adds new slots after the existing ones, so picks keep pointing at the same slot", () => {
        const earlier = { date: "2026-11-09", start: "09:00", end: "10:00" }
        const result = parseCalendarEdit({ title: "x", slots: [earlier] }, calendar, now)

        expect(result.ok && result.data.slots).toEqual([
            ...calendar.slots,
            { start: "2026-11-09T08:00:00.000Z", end: "2026-11-09T09:00:00.000Z" },
        ])
    })

    it("uses the link's own slot length, ignoring what the form sends", () => {
        const halfHour = {
            ...calendar,
            slots: [{ start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T09:30:00.000Z" }],
        }
        const result = parseCalendarEdit(
            { title: "x", slotMinutes: 60, slots: [{ ...range, end: "15:00" }] },
            halfHour,
            now
        )

        expect(result.ok && result.data.slots.slice(1)).toEqual([
            { start: "2026-11-10T13:00:00.000Z", end: "2026-11-10T13:30:00.000Z" },
            { start: "2026-11-10T13:30:00.000Z", end: "2026-11-10T14:00:00.000Z" },
        ])
    })

    it("rejects a range that overlaps a slot already on the link", () => {
        const result = parseCalendarEdit(
            { title: "x", slots: [{ ...range, start: "10:30", end: "11:30" }] },
            calendar,
            now
        )
        expect(result).toEqual({
            ok: false,
            fieldErrors: { "slots.0.start": "This range overlaps another one." },
        })
    })

    it("rejects an empty title and a range in the past", () => {
        expect(parseCalendarEdit({ title: "", slots: [] }, calendar, now)).toEqual({
            ok: false,
            fieldErrors: { title: "Enter a title." },
        })
        expect(parseCalendarEdit({ title: "x", slots: [{ ...range, date: "2026-11-01" }] }, calendar, now)).toEqual({
            ok: false,
            fieldErrors: { "slots.0.start": "This range must be in the future." },
        })
    })
})
