"use client";
import { Analytics } from "@vercel/analytics/react";

// Calendar links are private, so their URLs never go to analytics
const PRIVATE_PATHS = /^\/(calendar|admin)(\/|$)/;

export default function SiteAnalytics() {
    return (
        <Analytics beforeSend={(event) => (PRIVATE_PATHS.test(new URL(event.url).pathname) ? null : event)} />
    );
}
