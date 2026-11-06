import { describe, expect, it } from "vitest"
import { amsterdamToUtc, formatSlot, getSlotMinutes, groupSlotsByDay, splitIntoSlots } from "./time"

const slot = (start: string, end: string) => ({ start, end })

describe("amsterdamToUtc", () => {
    it("uses UTC+1 in winter", () => {
        expect(amsterdamToUtc("2026-11-10", "10:00")?.toISOString()).toBe("2026-11-10T09:00:00.000Z")
    })

    it("uses UTC+2 in summer", () => {
        expect(amsterdamToUtc("2027-07-01", "10:00")?.toISOString()).toBe("2027-07-01T08:00:00.000Z")
    })

    it("applies the right offset on each side of the spring change", () => {
        expect(amsterdamToUtc("2027-03-28", "01:59")?.toISOString()).toBe("2027-03-28T00:59:00.000Z")
        expect(amsterdamToUtc("2027-03-28", "03:00")?.toISOString()).toBe("2027-03-28T01:00:00.000Z")
    })

    it("applies the right offset on each side of the autumn change", () => {
        expect(amsterdamToUtc("2026-10-25", "01:59")?.toISOString()).toBe("2026-10-24T23:59:00.000Z")
        expect(amsterdamToUtc("2026-10-25", "03:00")?.toISOString()).toBe("2026-10-25T02:00:00.000Z")
    })

    it("rejects a time skipped by the spring change", () => {
        expect(amsterdamToUtc("2027-03-28", "02:30")).toBeNull()
    })

    it("rejects a date that doesn't exist", () => {
        expect(amsterdamToUtc("2026-02-31", "10:00")).toBeNull()
    })
})

describe("splitIntoSlots", () => {
    const at = (iso: string) => new Date(iso)

    it("keeps a range of exactly one slot as one slot", () => {
        expect(splitIntoSlots(at("2026-11-10T09:00:00.000Z"), at("2026-11-10T10:00:00.000Z"), 60)).toEqual([
            slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z"),
        ])
    })

    it("divides a range into half hours", () => {
        expect(splitIntoSlots(at("2026-11-10T09:00:00.000Z"), at("2026-11-10T10:00:00.000Z"), 30)).toEqual([
            slot("2026-11-10T09:00:00.000Z", "2026-11-10T09:30:00.000Z"),
            slot("2026-11-10T09:30:00.000Z", "2026-11-10T10:00:00.000Z"),
        ])
    })

    it("drops time left over at the end", () => {
        expect(splitIntoSlots(at("2026-11-10T09:00:00.000Z"), at("2026-11-10T11:30:00.000Z"), 60)).toEqual([
            slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z"),
            slot("2026-11-10T10:00:00.000Z", "2026-11-10T11:00:00.000Z"),
        ])
    })

    it("keeps the range's starting minutes", () => {
        expect(splitIntoSlots(at("2026-11-10T09:30:00.000Z"), at("2026-11-10T11:30:00.000Z"), 60)).toEqual([
            slot("2026-11-10T09:30:00.000Z", "2026-11-10T10:30:00.000Z"),
            slot("2026-11-10T10:30:00.000Z", "2026-11-10T11:30:00.000Z"),
        ])
    })

    it("returns nothing for a range shorter than a slot", () => {
        expect(splitIntoSlots(at("2026-11-10T09:00:00.000Z"), at("2026-11-10T09:59:00.000Z"), 60)).toEqual([])
    })
})

describe("getSlotMinutes", () => {
    it("recognises half-hour links", () => {
        expect(getSlotMinutes([slot("2026-11-10T09:00:00.000Z", "2026-11-10T09:30:00.000Z")])).toBe(30)
    })

    it("treats anything else as hourly, including older links", () => {
        expect(getSlotMinutes([slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z")])).toBe(60)
        expect(getSlotMinutes([slot("2026-11-10T09:00:00.000Z", "2026-11-10T09:45:00.000Z")])).toBe(60)
    })
})

describe("groupSlotsByDay", () => {
    it("groups by Amsterdam day, not UTC day", () => {
        // 23:30 UTC on the 9th is already 00:30 on the 10th in Amsterdam
        const days = groupSlotsByDay([
            slot("2026-11-09T23:30:00.000Z", "2026-11-10T00:30:00.000Z"),
            slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z"),
        ])

        expect(days).toHaveLength(1)
        expect(days[0].key).toBe("2026-11-10")
        expect(days[0].label).toBe("Tuesday 10 November")
    })

    it("sorts by start time and keeps each slot's stored index", () => {
        const days = groupSlotsByDay([
            slot("2026-11-11T09:00:00.000Z", "2026-11-11T10:00:00.000Z"),
            slot("2026-11-10T13:00:00.000Z", "2026-11-10T14:00:00.000Z"),
            slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z"),
        ])

        expect(days.map((day) => day.key)).toEqual(["2026-11-10", "2026-11-11"])
        expect(days[0].slots.map((entry) => entry.index)).toEqual([2, 1])
        expect(days[1].slots.map((entry) => entry.index)).toEqual([0])
    })
})

describe("formatSlot", () => {
    it("names the day and the Amsterdam time range", () => {
        expect(formatSlot(slot("2026-11-10T09:00:00.000Z", "2026-11-10T10:00:00.000Z"))).toBe(
            "Tuesday 10 November, 10:00 to 11:00"
        )
    })
})
