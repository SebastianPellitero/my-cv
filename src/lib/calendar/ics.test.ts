import { describe, expect, it } from "vitest"
import { buildSlotIcs } from "./ics"

const event = {
    uid: "abc-0@sebastianpellitero.dev",
    summary: "Interview with Sebastian Pellitero",
    slot: { start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" },
    stamp: new Date("2026-11-05T12:00:00.000Z"),
}

describe("buildSlotIcs", () => {
    it("writes a VEVENT with UTC times, a UID and a DTSTAMP", () => {
        const lines = buildSlotIcs(event).split("\r\n")

        expect(lines[0]).toBe("BEGIN:VCALENDAR")
        expect(lines).toContain("VERSION:2.0")
        expect(lines).toContain("UID:abc-0@sebastianpellitero.dev")
        expect(lines).toContain("DTSTAMP:20261105T120000Z")
        expect(lines).toContain("DTSTART:20261110T090000Z")
        expect(lines).toContain("DTEND:20261110T100000Z")
        expect(lines).toContain("SUMMARY:Interview with Sebastian Pellitero")
    })

    it("uses CRLF line endings throughout", () => {
        const ics = buildSlotIcs(event)
        expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true)
        expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/)
    })

    it("escapes reserved characters in text", () => {
        const ics = buildSlotIcs({ ...event, summary: "Call; with, a\\slash\nand newline" })
        expect(ics).toContain("SUMMARY:Call\\; with\\, a\\\\slash\\nand newline")
    })

    it("folds long lines at 75 octets without splitting characters", () => {
        const summary = "é".repeat(100)
        const lines = buildSlotIcs({ ...event, summary }).split("\r\n")
        const start = lines.findIndex((line) => line.startsWith("SUMMARY:"))
        const folded = lines.slice(start, lines.indexOf("END:VEVENT"))

        expect(folded.length).toBeGreaterThan(1)
        for (const line of folded) {
            expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
        }
        expect(folded.slice(1).every((line) => line.startsWith(" "))).toBe(true)
        expect(folded.map((line, i) => (i === 0 ? line : line.slice(1))).join("")).toBe(`SUMMARY:${summary}`)
    })
})
