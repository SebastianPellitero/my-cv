import { z } from "zod"
import { amsterdamToUtc, CALENDAR_TIMEZONE, getSlotMinutes, splitIntoSlots } from "./time"

export const LINK_TTL_SECONDS = 1_814_400 // 21 days

export const calendarIdSchema = z.uuid()

const utcDateTime = z.iso.datetime()

const storedCalendarSchema = z.object({
    id: calendarIdSchema,
    title: z.string().min(1),
    note: z.string().optional(),
    timezone: z.literal(CALENDAR_TIMEZONE),
    createdAt: utcDateTime,
    expiresAt: utcDateTime,
    slots: z.array(z.object({ start: utcDateTime, end: utcDateTime })).min(1),
})

export type StoredCalendar = z.infer<typeof storedCalendarSchema>

// A missing key and unreadable data both mean the link is gone
export function parseStoredCalendar(raw: unknown): StoredCalendar | null {
    const result = storedCalendarSchema.safeParse(raw)
    return result.success ? result.data : null
}

const storedPickSchema = z.object({
    slotIndex: z.number().int().min(0),
    pickedAt: utcDateTime,
})

export type StoredPick = z.infer<typeof storedPickSchema>

export const slotIndexSchema = storedPickSchema.shape.slotIndex

export function parseStoredPick(raw: unknown): StoredPick | null {
    const result = storedPickSchema.safeParse(raw)
    return result.success ? result.data : null
}

const detailFields = {
    title: z.string().trim().min(1, "Enter a title.").max(120, "Keep the title under 120 characters."),
    note: z.string().trim().max(280, "Keep the note under 280 characters.").optional(),
}

const rangesSchema = z
    .array(
        z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date."),
            start: z.string().regex(/^\d{2}:\d{2}$/, "Enter a start time."),
            end: z.string().regex(/^\d{2}:\d{2}$/, "Enter an end time."),
        })
    )
    .max(20, "Add 20 ranges at most.")

const calendarInputSchema = z.object({
    ...detailFields,
    slotMinutes: z.literal([30, 60]).default(60),
    slots: rangesSchema.min(1, "Add at least one range."),
})

const calendarEditSchema = z.object({ ...detailFields, slots: rangesSchema })

export type CalendarInput = {
    title: string
    note?: string
    slots: StoredCalendar["slots"]
}

// Keys are field paths such as "title" or "slots.0.end"
export type FieldErrors = Record<string, string>

export type ParsedCalendarInput =
    | { ok: true; data: CalendarInput }
    | { ok: false; fieldErrors: FieldErrors }

function toFieldErrors(error: z.ZodError): FieldErrors {
    const fieldErrors: FieldErrors = {}
    for (const issue of error.issues) {
        fieldErrors[issue.path.join(".") || "form"] ??= issue.message
    }
    return fieldErrors
}

type ParsedRanges = { ok: true; slots: CalendarInput["slots"] } | { ok: false; fieldErrors: FieldErrors }

// Form times are Europe/Amsterdam wall-clock ranges; the result is fixed-length slots in UTC
function parseRanges(
    inputs: z.infer<typeof rangesSchema>,
    slotMinutes: number,
    existing: CalendarInput["slots"],
    now: Date
): ParsedRanges {
    const fieldErrors: FieldErrors = {}
    const ranges: { start: Date; end: Date }[] = []
    const taken = existing.map((slot) => ({ start: new Date(slot.start), end: new Date(slot.end) }))

    inputs.forEach((slot, index) => {
        const start = amsterdamToUtc(slot.date, slot.start)
        const end = amsterdamToUtc(slot.date, slot.end)

        if (!start) fieldErrors[`slots.${index}.start`] = "That time doesn't exist on this date."
        if (!end) fieldErrors[`slots.${index}.end`] = "That time doesn't exist on this date."
        if (!start || !end) return

        if (end <= start) {
            fieldErrors[`slots.${index}.end`] = "End time must be after the start time."
        } else if (start <= now) {
            fieldErrors[`slots.${index}.start`] = "This range must be in the future."
        } else if (splitIntoSlots(start, end, slotMinutes).length === 0) {
            const minimum = slotMinutes === 30 ? "30 minutes" : "1 hour"
            fieldErrors[`slots.${index}.end`] = `A range must be at least ${minimum} long.`
        } else if ([...taken, ...ranges].some((range) => start < range.end && end > range.start)) {
            fieldErrors[`slots.${index}.start`] = "This range overlaps another one."
        } else {
            ranges.push({ start, end })
        }
    })

    if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

    return { ok: true, slots: ranges.flatMap(({ start, end }) => splitIntoSlots(start, end, slotMinutes)) }
}

export function parseCalendarInput(raw: unknown, now = new Date()): ParsedCalendarInput {
    const result = calendarInputSchema.safeParse(raw)
    if (!result.success) return { ok: false, fieldErrors: toFieldErrors(result.error) }

    const { title, note, slotMinutes, slots } = result.data
    const ranges = parseRanges(slots, slotMinutes, [], now)
    if (!ranges.ok) return ranges

    return { ok: true, data: { title, note: note || undefined, slots: ranges.slots } }
}

// Picks point at a slot's position, so existing slots keep theirs and new ones go after them
export function parseCalendarEdit(
    raw: unknown,
    calendar: StoredCalendar,
    now = new Date()
): ParsedCalendarInput {
    const result = calendarEditSchema.safeParse(raw)
    if (!result.success) return { ok: false, fieldErrors: toFieldErrors(result.error) }

    const { title, note, slots } = result.data
    const ranges = parseRanges(slots, getSlotMinutes(calendar.slots), calendar.slots, now)
    if (!ranges.ok) return ranges

    return {
        ok: true,
        data: { title, note: note || undefined, slots: [...calendar.slots, ...ranges.slots] },
    }
}
