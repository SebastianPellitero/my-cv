"use client";
import { useRef, useState, useTransition } from "react";
import { deleteCalendarLink } from "@/app/admin/calendar/actions";
import CopyButton from "./CopyButton";
import { card, focusRing, secondaryButton } from "./styles";

type ActiveLink = {
    id: string;
    title: string;
    expiresLabel: string;
    pickLabel?: string;
};

type Props = {
    origin: string;
    links: ActiveLink[];
};

export default function ActiveLinks({ origin, links }: Props) {
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState("");
    const headingRef = useRef<HTMLHeadingElement>(null);

    function remove({ id, title }: ActiveLink) {
        if (!window.confirm(`Delete the link "${title}"? It will stop working immediately.`)) return;

        startTransition(async () => {
            try {
                await deleteCalendarLink(id);
                setStatus(`Deleted ${title}`);
                // The focused button is gone with its row
                headingRef.current?.focus();
            } catch {
                setStatus(`Couldn't delete ${title}. Try again.`);
            }
        });
    }

    return (
        <section aria-labelledby="active-links-heading">
            <h2
                id="active-links-heading"
                ref={headingRef}
                tabIndex={-1}
                className={`mb-4 font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal ${focusRing}`}
            >
                Active links
            </h2>

            <p role="status" className="mb-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {status}
            </p>

            {links.length === 0 ? (
                <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">No active links.</p>
            ) : (
                <ul className="grid gap-4">
                    {links.map((link) => {
                        const url = `${origin}/calendar/${link.id}`;
                        return (
                            <li key={link.id} className={`${card} grid gap-3`}>
                                <div>
                                    <h3 className="font-serif text-lg text-zinc-900 dark:text-zinc-100">{link.title}</h3>
                                    <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                                        Valid until {link.expiresLabel} (Amsterdam time)
                                    </p>
                                    <p className="mt-1 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                                        {link.pickLabel ? `Picked: ${link.pickLabel}` : "No slot picked yet"}
                                    </p>
                                </div>
                                <code className="font-mono text-xs break-all text-zinc-700 dark:text-zinc-300">{url}</code>
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={pending}
                                        onClick={() => remove(link)}
                                        className={secondaryButton}
                                    >
                                        Delete<span className="sr-only"> {link.title}</span>
                                    </button>
                                    <CopyButton text={url} label={`link for ${link.title}`} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
