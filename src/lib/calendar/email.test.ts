import { describe, expect, it } from "vitest"
import { buildPickEmail } from "./email"

const base = {
    title: "Sebastian's availability for Coolblue",
    slotLabel: "Tuesday 10 November, 10:00 to 11:00",
    timezone: "Europe/Amsterdam",
}

describe("buildPickEmail", () => {
    it("names the link and the slot for a first pick", () => {
        expect(buildPickEmail(base)).toEqual({
            subject: "Slot picked: Sebastian's availability for Coolblue",
            text: "Picked: Tuesday 10 November, 10:00 to 11:00 (Europe/Amsterdam)\n\nLink: Sebastian's availability for Coolblue",
        })
    })

    it("includes the note when the link has one", () => {
        const { text } = buildPickEmail({ ...base, note: "Second round with the team lead" })

        expect(text).toBe(
            "Picked: Tuesday 10 November, 10:00 to 11:00 (Europe/Amsterdam)\n\nLink: Sebastian's availability for Coolblue\nNote: Second round with the team lead",
        )
    })

    it("shows the new and old slot for a change", () => {
        const email = buildPickEmail({
            ...base,
            slotLabel: "Wednesday 11 November, 14:00 to 15:00",
            previousSlotLabel: "Tuesday 10 November, 10:00 to 11:00",
        })

        expect(email).toEqual({
            subject: "Slot changed: Sebastian's availability for Coolblue",
            text: "New: Wednesday 11 November, 14:00 to 15:00 (Europe/Amsterdam)\nWas: Tuesday 10 November, 10:00 to 11:00\n\nLink: Sebastian's availability for Coolblue",
        })
    })
})
