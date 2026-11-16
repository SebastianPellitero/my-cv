import IntroGate from "@/components/intro/IntroGate";
import { companies } from "@/data/intro";

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

// Same figures as the Experience page and the intro
const facts = [
    { value: "9+", label: "Years building for the web" },
    { value: "5", label: "Companies & projects" },
    { value: "NL", label: "Based in the Netherlands, from Buenos Aires" },
    { value: "Now", label: "Preparing for the IAAP WAS accessibility exam" },
];

const secondaryLink =
    "font-mono text-xs tracking-[0.15em] uppercase border-b pb-0.5 hover:opacity-60 transition-opacity text-teal-ink border-teal-ink dark:text-teal dark:border-teal";

const primaryButton =
    "font-mono text-xs tracking-[0.15em] uppercase px-5 py-3 rounded-sm bg-teal-ink text-white hover:bg-teal-ink/85 dark:bg-teal dark:text-zinc-950 dark:hover:bg-teal/85 transition-colors";

const sectionLabel ="font-mono text-xs tracking-[0.2em] uppercase text-teal-ink dark:text-teal";

export default function HomePage() {
    return (
        <IntroGate>
            {/* Full-width so the mouse glow fades out on its own instead of being cut off by a box */}
            <div data-glow className="group/glow relative overflow-x-clip">
                {/* Mouse glow: IntroGate keeps --mx / --my at the pointer */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500 [background:radial-gradient(480px_circle_at_var(--mx,50%)_var(--my,30%),rgba(45,212,191,0.10),transparent_65%)]" />

                <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">

                    {/* ── Hero ── */}
                    <header className="grid gap-12 lg:grid-cols-[1fr_17rem] lg:items-end lg:gap-16">
                        <div>
                            {/* Label */}
                            <div data-reveal="fade" className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="inline-block w-6 h-px bg-teal" />
                                    <span className={sectionLabel}>Senior Frontend Developer</span>
                                </div>
                                {/* Availability: the words carry the meaning, the dot is decoration */}
                                <p className="flex items-center gap-2 font-mono text-xs tracking-[0.1em] uppercase text-zinc-700 dark:text-zinc-300">
                                    <span aria-hidden className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping [animation-duration:2.5s]" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                    </span>
                                    Available for new roles
                                </p>
                            </div>

                            {/* Name */}
                            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-8">
                                {/* Each line slides up from behind its own mask on reveal */}
                                <span className="block overflow-hidden">
                                    <span data-reveal="line" className="block">Sebastian </span>
                                </span>
                                <span className="block overflow-hidden">
                                    <em data-reveal="line" className="block text-teal-ink dark:text-teal">Pellitero.</em>
                                </span>
                            </h1>

                            {/* Accent rule */}
                            <div data-reveal="rule" className="w-12 h-0.5 bg-accent mb-8" />

                            {/* Bio */}
                            <p data-reveal="fade" className="font-mono text-sm sm:text-base leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400 mb-8">
                                I build scalable, accessible web apps with React + TypeScript —
                                with a taste for clean architecture, ruthless performance,
                                and UI that doesn&apos;t fight the user.
                            </p>

                            {/* Tags */}
                            <ul data-reveal="fade" className="flex flex-wrap gap-2 mb-10">
                                {["React", "TypeScript", "Next.js", "Accessibility", "Testing"].map((t) => (
                                    <li
                                        key={t}
                                        className="font-mono text-xs tracking-[0.1em] uppercase px-3 py-1 border rounded-sm border-teal-ink text-teal-ink dark:border-teal dark:text-teal"
                                    >
                                        {t}
                                    </li>
                                ))}
                            </ul>

                            {/* CTAs: Experience, Projects and Garden live in the nav bar */}
                            <div data-reveal="fade" className="flex flex-wrap items-center gap-6">
                                <a href="mailto:sebastian.pellitero@gmail.com" className={primaryButton}>
                                    Email me
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/sebastian-pellitero/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={secondaryLink}
                                >
                                    LinkedIn →
                                </a>
                                <a
                                    href="https://github.com/SebastianPellitero"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={secondaryLink}
                                >
                                    GitHub →
                                </a>
                            </div>
                        </div>

                        {/* Facts: a side column on wide screens, a 2x2 grid under the hero on small ones */}
                        <dl
                            data-reveal="fade"
                            className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-200 pt-8 dark:border-zinc-800
                                       lg:grid-cols-1 lg:gap-y-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
                        >
                            {facts.map((f) => (
                                // dt/dd order is reversed visually so the big value leads, but the label still names it.
                                // justify-end is the top of a reversed column, which keeps the values level across a row
                                <div key={f.label} className="flex flex-col-reverse justify-end gap-1">
                                    <dt className="font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{f.label}</dt>
                                    <dd className="font-serif text-4xl leading-none text-zinc-900 dark:text-zinc-100">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </header>

                    {/* ── Worked with ── */}
                    <section
                        aria-labelledby="worked-heading"
                        data-scroll-reveal
                        className="mt-16 flex flex-col gap-5 border-y border-zinc-200 py-6 dark:border-zinc-800
                                   sm:mt-20 lg:flex-row lg:items-center lg:gap-10"
                    >
                        <h2 id="worked-heading" className={`${sectionLabel} shrink-0`}>Worked with</h2>
                        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            {companies.map((c) => (
                                <li key={c.label} className="flex items-center gap-2.5">
                                    {/* light tile: some site icons (Globant) are dark-on-transparent */}
                                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny static icons, no optimisation needed */}
                                    <img src={c.img} alt="" className="h-7 w-auto max-w-[72px] object-contain rounded-md bg-zinc-100 p-0.5" />
                                    <span className="font-mono text-xs tracking-[0.08em] uppercase text-zinc-700 dark:text-zinc-300">
                                        {c.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* ── Focus areas ── */}
                    <section aria-labelledby="focus-heading" className="mt-20 sm:mt-28">
                        <div data-scroll-reveal className="flex items-center gap-3 mb-6">
                            <span className="inline-block w-6 h-px bg-teal" />
                            <h2 id="focus-heading" className={sectionLabel}>What I focus on</h2>
                        </div>
                        <ol className="border-b border-zinc-200 dark:border-zinc-800">
                            {skills.map((c, i) => (
                                <li
                                    key={c.title}
                                    data-scroll-reveal
                                    // Rows that enter together still arrive one after another
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                    className="group grid gap-x-8 gap-y-2 border-t border-zinc-200 py-7 dark:border-zinc-800
                                               sm:grid-cols-[3rem_1fr_1.2fr] sm:items-baseline"
                                >
                                    <span aria-hidden className="font-mono text-xs tracking-[0.15em] text-teal-ink dark:text-teal">
                                        0{i + 1}
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-zinc-900 dark:text-zinc-100
                                                   transition-transform duration-300 group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0">
                                        {c.title}
                                    </h3>
                                    <p className="font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                        {c.text}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* ── What's next: same words as the last section of the Experience page ── */}
                    <section aria-labelledby="next-heading" data-scroll-reveal className="mt-24 sm:mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-block w-6 h-px bg-teal" />
                            <span className={sectionLabel}>What&apos;s next</span>
                        </div>
                        <h2 id="next-heading" className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-8">
                            Open to <em className="text-teal-ink dark:text-teal">new challenges.</em>
                        </h2>
                        <p className="font-mono text-sm sm:text-base leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400 mb-10">
                            Looking for a senior frontend role where engineering is respected,
                            the team shares knowledge openly, and the product actually matters.
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                            <a href="mailto:sebastian.pellitero@gmail.com" className={primaryButton}>
                                Email me
                            </a>
                            <a
                                href="https://www.linkedin.com/in/sebastian-pellitero/"
                                target="_blank"
                                rel="noreferrer"
                                className={secondaryLink}
                            >
                                LinkedIn →
                            </a>
                        </div>
                    </section>

                </div>
            </div>
        </IntroGate>
    );
}
