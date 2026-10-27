import Link from "next/link";
import IntroGate from "@/components/intro/IntroGate";

const skills = [
    {
        title: "Frontend Architecture",
        text: "Component systems, design tokens, scalable patterns, predictable state.",
    },
    {
        title: "Performance",
        text: "Core Web Vitals, LCP/INP/CLS, hydration strategy, smart loading.",
    },
    {
        title: "Accessibility",
        text: "Keyboard-first UX, screen readers, semantic HTML, WCAG mindset.",
    },
];

const secondaryLink =
    "font-mono text-xs tracking-[0.15em] uppercase border-b pb-0.5 hover:opacity-60 transition-opacity";

export default function HomePage() {
    return (
        <IntroGate>
            <div className="mx-auto max-w-5xl px-6 py-16">

                {/* ── Hero ── */}
                <header className="relative overflow-hidden rounded-3xl border p-6 sm:p-10
                             border-zinc-200 bg-white text-zinc-900
                             dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100">

                    {/* Subtle gradient blob */}
                    <div className="pointer-events-none absolute inset-0 opacity-50
              [background:radial-gradient(600px_circle_at_15%_30%,rgba(45,212,191,0.12),transparent_55%),radial-gradient(700px_circle_at_85%_20%,rgba(240,165,0,0.07),transparent_55%)]
              dark:[background:radial-gradient(600px_circle_at_15%_30%,rgba(45,212,191,0.1),transparent_55%),radial-gradient(700px_circle_at_85%_20%,rgba(240,165,0,0.07),transparent_55%)]" />

                    {/* Grid lines */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(45,212,191,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,1) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />

                    {/* Decorative initials (before content so it paints underneath) */}
                    <span aria-hidden className="pointer-events-none select-none absolute right-8 bottom-2 font-serif text-[9rem] leading-none text-zinc-100 dark:text-white/[0.03]">
                        SP
                    </span>

                    <div className="relative">

                        {/* Label */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-block w-6 h-px bg-teal" />
                            <span className="text-xs tracking-[0.2em] uppercase font-mono text-teal-ink dark:text-teal">
                                Senior Frontend Developer
                            </span>
                        </div>

                        {/* Name */}
                        <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-6">
                            Sebastian<br />
                            <em className="text-teal-ink dark:text-teal">Pellitero.</em>
                        </h1>

                        {/* Accent rule */}
                        <div className="w-12 h-0.5 bg-accent mb-6" />

                        {/* Bio */}
                        <p className="font-mono text-sm leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400 mb-8">
                            I build scalable, accessible web apps with React + TypeScript —
                            with a taste for clean architecture, ruthless performance,
                            and UI that doesn&apos;t fight the user.
                        </p>

                        {/* Tags */}
                        <ul className="flex flex-wrap gap-2 mb-10">
                            {["React", "TypeScript", "Next.js", "Accessibility", "Testing"].map((t) => (
                                <li
                                    key={t}
                                    className="font-mono text-xs tracking-[0.1em] uppercase px-3 py-1 border rounded-sm border-teal-ink text-teal-ink dark:border-teal dark:text-teal"
                                >
                                    {t}
                                </li>
                            ))}
                            {["Performance", "Design Systems", "CI/CD"].map((t) => (
                                <li
                                    key={t}
                                    className="font-mono text-xs tracking-[0.1em] uppercase px-3 py-1 border rounded-sm border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-6">
                            <a
                                href="mailto:sebastian.pellitero@gmail.com"
                                className="font-mono text-xs tracking-[0.15em] uppercase px-5 py-3 rounded-sm
                                           bg-teal-ink text-white hover:bg-teal-ink/85
                                           dark:bg-teal dark:text-zinc-950 dark:hover:bg-teal/85 transition-colors"
                            >
                                Email me
                            </a>
                            <a
                                href="https://www.linkedin.com/in/sebastian-pellitero/"
                                target="_blank"
                                rel="noreferrer"
                                className={`${secondaryLink} text-teal-ink border-teal-ink dark:text-teal dark:border-teal`}
                            >
                                LinkedIn →
                            </a>
                            <a
                                href="https://github.com/SebastianPellitero"
                                target="_blank"
                                rel="noreferrer"
                                className={`${secondaryLink} text-teal-ink border-teal-ink dark:text-teal dark:border-teal`}
                            >
                                GitHub →
                            </a>
                            <Link
                                href="/about"
                                className={`${secondaryLink} text-accent-ink border-accent-ink dark:text-accent dark:border-accent`}
                            >
                                Experience →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ── Skill cards ── */}
                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    {skills.map((c) => (
                        <div
                            key={c.title}
                            className="relative overflow-hidden rounded-2xl border p-6
                           border-zinc-200 bg-white
                           dark:border-zinc-800 dark:bg-zinc-900/40
                           group hover:border-teal transition-colors duration-300"
                        >
                            {/* Hover glow */}
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 [background:radial-gradient(300px_circle_at_50%_0%,rgba(45,212,191,0.06),transparent_70%)]" />

                            <div className="relative flex items-center gap-2 mb-3">
                                <span className="inline-block w-4 h-px bg-teal" />
                                <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal">
                                    {c.title}
                                </h2>
                            </div>
                            <p className="relative font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                {c.text}
                            </p>
                        </div>
                    ))}
                </section>

            </div>
        </IntroGate>
    );
}
