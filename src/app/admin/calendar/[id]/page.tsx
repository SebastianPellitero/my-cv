import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updateCalendarLink } from "@/app/admin/calendar/actions";
import CalendarForm from "@/components/calendar/CalendarForm";
import { pageHeading } from "@/components/calendar/styles";
import { ADMIN_PATH, requireAdmin } from "@/lib/admin-auth";
import { getCalendar } from "@/lib/calendar/store";
import { formatSlot, getSlotMinutes, groupSlotsByDay } from "@/lib/calendar/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Edit link",
    robots: { index: false, follow: false },
};

export default async function EditCalendarPage({ params }: { params: Promise<{ id: string }> }) {
    await requireAdmin();

    const { id } = await params;
    const calendar = await getCalendar(id);
    if (!calendar) redirect(ADMIN_PATH);

    const currentSlots = groupSlotsByDay(calendar.slots).flatMap((day) =>
        day.slots.map(({ slot }) => formatSlot(slot))
    );

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className={pageHeading}>Edit link</h1>
            <CalendarForm
                edit={{
                    action: updateCalendarLink.bind(null, id),
                    title: calendar.title,
                    note: calendar.note ?? "",
                    slotMinutes: getSlotMinutes(calendar.slots),
                    currentSlots,
                }}
            />
        </div>
    );
}
