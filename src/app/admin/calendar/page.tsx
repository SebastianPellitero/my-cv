import type { Metadata } from "next";
import { headers } from "next/headers";
import ActiveLinks from "@/components/calendar/ActiveLinks";
import CalendarForm from "@/components/calendar/CalendarForm";
import LoginForm from "@/components/calendar/LoginForm";
import { pageHeading } from "@/components/calendar/styles";
import { isAdmin } from "@/lib/admin-auth";
import { getPicks, listCalendars } from "@/lib/calendar/store";
import { formatExpiry, formatSlot } from "@/lib/calendar/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Calendar links",
    robots: { index: false, follow: false },
};

async function getOrigin() {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
    return `${protocol}://${host}`;
}

export default async function AdminCalendarPage() {
    if (!(await isAdmin())) {
        return (
            <div className="mx-auto max-w-md px-6 py-16">
                <h1 className={pageHeading}>Sign in</h1>
                <LoginForm />
            </div>
        );
    }

    const [origin, calendars] = await Promise.all([getOrigin(), listCalendars()]);
    const picks = await getPicks(calendars.map((calendar) => calendar.id));
    const links = calendars.map(({ id, title, expiresAt, slots }) => {
        const pick = picks.get(id);
        const pickedSlot = pick && slots[pick.slotIndex];

        return {
            id,
            title,
            expiresLabel: formatExpiry(expiresAt),
            pickLabel: pickedSlot && formatSlot(pickedSlot),
        };
    });

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className={pageHeading}>Calendar links</h1>
            <CalendarForm origin={origin} />
            <ActiveLinks origin={origin} links={links} />
        </div>
    );
}
