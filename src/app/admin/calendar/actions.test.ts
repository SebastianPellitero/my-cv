import { beforeEach, describe, expect, it, vi } from "vitest"
import { requireAdmin } from "@/lib/admin-auth"
import type { StoredCalendar } from "@/lib/calendar/schema"
import { getCalendar, updateCalendar } from "@/lib/calendar/store"
import { updateCalendarLink } from "./actions"

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("redirected")
    }),
}))
vi.mock("@/lib/admin-auth", () => ({ ADMIN_PATH: "/admin/calendar", requireAdmin: vi.fn() }))
vi.mock("@/lib/calendar/store", () => ({ getCalendar: vi.fn(), updateCalendar: vi.fn() }))

const id = "3f2b8c1e-7a4d-4e6f-9b1a-2c3d4e5f6a7b"
const idle = { status: "idle" } as const
const gone = { status: "error", fieldErrors: { form: "This link has expired or was deleted." } }

const calendar: StoredCalendar = {
    id,
    title: "Availability for Coolbue",
    timezone: "Europe/Amsterdam",
    createdAt: "2026-11-05T12:00:00.000Z",
    expiresAt: "2026-11-19T12:00:00.000Z",
    slots: [{ start: "2030-11-10T09:00:00.000Z", end: "2030-11-10T10:00:00.000Z" }],
}

describe("updateCalendarLink", () => {
    beforeEach(() => {
        vi.mocked(requireAdmin).mockReset()
        vi.mocked(getCalendar).mockReset().mockResolvedValue(calendar)
        vi.mocked(updateCalendar).mockReset().mockResolvedValue(true)
    })

    it("checks the session before touching anything", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new Error("redirected to login"))

        await expect(updateCalendarLink(id, idle, { title: "x", slots: [] })).rejects.toThrow("redirected to login")
        expect(getCalendar).not.toHaveBeenCalled()
        expect(updateCalendar).not.toHaveBeenCalled()
    })

    it("saves the change and returns to the list", async () => {
        const input = { title: "Availability for Coolblue", slots: [] }

        await expect(updateCalendarLink(id, idle, input)).rejects.toThrow("redirected")
        expect(updateCalendar).toHaveBeenCalledExactlyOnceWith(calendar, {
            title: "Availability for Coolblue",
            note: undefined,
            slots: calendar.slots,
        })
    })

    it("returns validation errors without saving", async () => {
        const result = await updateCalendarLink(id, idle, { title: "", slots: [] })

        expect(result).toEqual({ status: "error", fieldErrors: { title: "Enter a title." } })
        expect(updateCalendar).not.toHaveBeenCalled()
    })

    it("reports a link that has already gone", async () => {
        vi.mocked(getCalendar).mockResolvedValue(null)
        expect(await updateCalendarLink(id, idle, { title: "x", slots: [] })).toEqual(gone)
    })

    it("reports a link that disappears while saving", async () => {
        vi.mocked(updateCalendar).mockResolvedValue(false)
        expect(await updateCalendarLink(id, idle, { title: "x", slots: [] })).toEqual(gone)
    })

    it("rejects a bad id", async () => {
        expect(await updateCalendarLink("calendar:*", idle, { title: "x", slots: [] })).toEqual(gone)
        expect(getCalendar).not.toHaveBeenCalled()
    })
})
