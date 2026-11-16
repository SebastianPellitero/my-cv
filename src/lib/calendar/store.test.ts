import { beforeEach, describe, expect, it, vi } from "vitest"
import type { StoredCalendar } from "./schema"
import { savePick, updateCalendar } from "./store"

const set = vi.hoisted(() => vi.fn())

vi.mock("server-only", () => ({}))
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: () => ({ set }) } }))

const id = "3f2b8c1e-7a4d-4e6f-9b1a-2c3d4e5f6a7b"
const expiresAtSeconds = Date.parse("2026-11-19T12:00:00.000Z") / 1000

const calendar: StoredCalendar = {
    id,
    title: "Availability",
    timezone: "Europe/Amsterdam",
    createdAt: "2026-11-05T12:00:00.000Z",
    expiresAt: "2026-11-19T12:00:00.000Z",
    slots: [{ start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" }],
}

describe("updateCalendar", () => {
    beforeEach(() => set.mockReset())

    it("keeps the link's expiry and only writes over a link that still exists", async () => {
        set.mockResolvedValue("OK")

        expect(await updateCalendar(calendar, { title: "New title", slots: calendar.slots })).toBe(true)
        expect(set).toHaveBeenCalledExactlyOnceWith(
            `calendar:${id}`,
            { ...calendar, title: "New title" },
            { exat: expiresAtSeconds, xx: true }
        )
    })

    it("reports a link that has gone instead of bringing it back", async () => {
        set.mockResolvedValue(null)

        expect(await updateCalendar(calendar, { title: "New title", slots: calendar.slots })).toBe(false)
    })
})

describe("savePick", () => {
    beforeEach(() => set.mockReset())

    it("expires with the link and returns the pick it replaced", async () => {
        const previous = { slotIndex: 0, pickedAt: "2026-11-06T12:00:00.000Z" }
        set.mockResolvedValue(previous)

        expect(await savePick(calendar, 1, new Date("2026-11-07T12:00:00.000Z"))).toEqual(previous)
        expect(set).toHaveBeenCalledExactlyOnceWith(
            `calendar-pick:${id}`,
            { slotIndex: 1, pickedAt: "2026-11-07T12:00:00.000Z" },
            { exat: expiresAtSeconds, get: true }
        )
    })

    it("returns null for a first pick", async () => {
        set.mockResolvedValue(null)

        expect(await savePick(calendar, 0)).toBeNull()
    })
})
