"use server";

import { revalidatePath } from "next/cache";
import { buildPickEmail } from "@/lib/calendar/email";
import { sendOwnerEmail } from "@/lib/calendar/notify";
import { calendarIdSchema, slotIndexSchema } from "@/lib/calendar/schema";
import { allowPick, getCalendar, savePick } from "@/lib/calendar/store";
import { CALENDAR_TIMEZONE, formatSlot } from "@/lib/calendar/time";

export type PickResult = { status: "ok" | "expired" | "limited" | "error" };

export async function pickSlot(id: unknown, slotIndex: unknown): Promise<PickResult> {
    const parsedId = calendarIdSchema.safeParse(id);
    const parsedIndex = slotIndexSchema.safeParse(slotIndex);
    if (!parsedId.success || !parsedIndex.success) return { status: "error" };

    try {
        const calendar = await getCalendar(parsedId.data);
        if (!calendar) return { status: "expired" };

        const slot = calendar.slots[parsedIndex.data];
        if (!slot) return { status: "error" };

        if (!(await allowPick(calendar.id))) return { status: "limited" };

        const previous = await savePick(calendar, parsedIndex.data);

        if (previous?.slotIndex !== parsedIndex.data) {
            const previousSlot = previous && calendar.slots[previous.slotIndex];
            const email = buildPickEmail({
                title: calendar.title,
                note: calendar.note,
                slotLabel: formatSlot(slot),
                timezone: CALENDAR_TIMEZONE,
                previousSlotLabel: previousSlot ? formatSlot(previousSlot) : undefined,
            });

            // The pick is saved and visible in the admin page, so a failed email isn't the visitor's problem
            await sendOwnerEmail(email).catch((error: unknown) => {
                console.error("Slot pick email failed:", error instanceof Error ? error.message : error);
            });
        }
    } catch {
        return { status: "error" };
    }

    revalidatePath(`/calendar/${parsedId.data}`);
    return { status: "ok" };
}
