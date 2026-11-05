import type { Metadata } from "next";
import { headers } from "next/headers";
import ActiveLinks from "@/components/calendar/ActiveLinks";
import CalendarForm from "@/components/calendar/CalendarForm";
import LoginForm from "@/components/calendar/LoginForm";
import { isAdmin } from "@/lib/admin-auth";
import { listCalendars } from "@/lib/calendar/store";
import { formatExpiry } from "@/lib/calendar/time";

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
    const heading = "font-serif text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-8";

    if (!(await isAdmin())) {
        return (
            <div className="mx-auto max-w-md px-6 py-16">
                <h1 className={heading}>Sign in</h1>
                <LoginForm />
            </div>
        );
    }

    const [origin, calendars] = await Promise.all([getOrigin(), listCalendars()]);
    const links = calendars.map(({ id, title, expiresAt }) => ({
        id,
        title,
        expiresLabel: formatExpiry(expiresAt),
    }));

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className={heading}>Calendar links</h1>
            <CalendarForm origin={origin} />
            <ActiveLinks origin={origin} links={links} />
        </div>
    );
}
