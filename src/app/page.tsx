"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full border px-3 py-1 text-xs
                   border-zinc-300 bg-zinc-50 text-zinc-700
                   dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200">
        {children}
    </span>
);

export default function HomePage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-16">
            <header className="relative overflow-hidden rounded-3xl border border-zinc-300 bg-white p-10 text-zinc-900 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900/70 dark:to-zinc-950 dark:text-zinc-100">
                <div className="pointer-events-none absolute inset-0 opacity-60 dark:[background:radial-gradient(600px_circle_at_20%_20%,rgba(99,102,241,0.18),transparent_50%),radial-gradient(700px_circle_at_80%_30%,rgba(16,185,129,0.12),transparent_55%)]" />

                <div className="relative flex items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <Pill>Senior Frontend</Pill>
                            <Pill>React • TypeScript</Pill>
                            <Pill>Performance • A11y</Pill>
                        </div>

                        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                            Sebastian Pellitero
                        </h1>
                        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
                            I build scalable, accessible web apps with React + TypeScript — with a taste for
                            clean architecture, ruthless performance, and UI that doesn’t fight the user.
                        </p>
                        <p className="mt-8">  Lets chat via Linkedin:</p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {/* <Link
                                href="/cv"
                                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                            >
                                View CV
                            </Link> */}
                            <a
                                href="https://www.linkedin.com/in/sebastian-pellitero/"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
                            >
                                LinkedIn
                            </a>
                            {/* <a
                                href="mailto:you@email.com"
                                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
                            >
                                Contact
                            </a> */}
                        </div>
                    </div>
                </div>
            </header>

            <section className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                    {
                        title: "Frontend Architecture",
                        text: "Component systems, design tokens, scalable patterns, predictable state.",
                    },
                    { title: "Performance", text: "Core Web Vitals, LCP/INP/CLS, hydration strategy, smart loading." },
                    { title: "Accessibility", text: "Keyboard-first UX, screen readers, semantic HTML, WCAG mindset." },
                ].map((c) => (
                    <div
                        key={c.title}
                        className="rounded-2xl border border-zinc-300 bg-white p-6 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
                    >
                        <h2 className="text-sm font-semibold">{c.title}</h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{c.text}</p>
                    </div>
                ))}
            </section>
        </main>
    );
}
