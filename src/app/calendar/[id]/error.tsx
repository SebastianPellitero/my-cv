"use client";
import Link from "next/link";
import { inlineLink, secondaryButton } from "@/components/calendar/styles";

// Shown when Redis can't be reached, so an outage never reads as an expired link
export default function CalendarError({ reset }: { reset: () => void }) {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            {/* Metadata can't load during an outage, so the title is set here */}
            <title>Temporarily unavailable</title>
            <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-4">
                Temporarily unavailable
            </h1>
            <p className="font-mono text-sm leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400 mb-8">
                This page couldn&apos;t be loaded right now. Your link may still be valid, so please try again shortly.
            </p>
            <div className="flex flex-wrap items-center gap-6 font-mono text-sm">
                <button type="button" onClick={reset} className={secondaryButton}>
                    Try again
                </button>
                <Link href="/contact" className={inlineLink}>
                    Contact
                </Link>
            </div>
        </div>
    );
}
