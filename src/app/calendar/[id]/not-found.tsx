import type { Metadata } from "next";
import Link from "next/link";
import { inlineLink } from "@/components/calendar/styles";

export const metadata: Metadata = {
    title: { absolute: "This link has expired" },
    robots: { index: false, follow: false },
};

export default function CalendarLinkExpired() {
    const contactEmail = process.env.CONTACT_EMAIL;

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-4">
                This link has expired
            </h1>
            <p className="font-mono text-sm leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400 mb-8">
                Links like this one only stay active for a limited time. If you still need it, please get in touch.
            </p>
            <ul className="flex flex-wrap gap-6 font-mono text-sm">
                <li>
                    <Link href="/" className={inlineLink}>
                        Visit sebastianpellitero.dev
                    </Link>
                </li>
                <li>
                    {contactEmail ? (
                        <a href={`mailto:${contactEmail}`} className={inlineLink}>
                            {contactEmail}
                        </a>
                    ) : (
                        <Link href="/contact" className={inlineLink}>
                            Contact
                        </Link>
                    )}
                </li>
            </ul>
        </div>
    );
}
