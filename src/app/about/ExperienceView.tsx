'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import s from './Experience.module.css'

// ─── Polaroid stack ──────────────────────────────────────────────────────────

// Fixed rotations so they look natural but never change between renders
const ROTATIONS = [-6, 3, -2, 5, -4, 2]

function PolaroidStack({ photos }: { photos: { src: string; alt: string }[] }) {
    return (
        <div className={s.polaroidStack}>
            {photos.map((photo, i) => (
                <div
                    key={i}
                    className={s.polaroid}
                    style={{ '--rotation': `${ROTATIONS[i % ROTATIONS.length]}deg` } as React.CSSProperties}
                >
                    <div className={s.polaroidImg}>
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            style={{ objectFit: 'cover' }}
                            // Images won't 404-crash the page if missing in dev
                            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                        />
                    </div>
                    <div className={s.polaroidCaption}>{photo.alt}</div>
                </div>
            ))}
        </div>
    )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: 'intro' },
    {
        id: 'foleon',
        period: '2021 — 2025 · Amsterdam, NL',
        role: 'Senior Frontend Developer',
        company: 'Foleon',
        body: 'Led key epics end-to-end, aligning stakeholders, product and design. Worked on a complex canvas-based editor used by enterprise clients worldwide.',
        achievements: [
            'Drove the Cypress → Playwright migration with screenshot regression tests',
            'Extracted shared UI component libraries, reducing codebase duplication',
            'Shipped feature-flagged continuous deployment with staged rollouts',
            'Instrumented user event tracking to support product decisions',
        ],
        tags: ['React', 'TypeScript', 'Playwright', 'Design Systems', 'CI/CD', 'Shape Up'],
        highlights: ['React', 'TypeScript', 'Playwright'],
        decoNum: '01',
        photos: [
            { src: '/about/foleon-1.jpg', alt: 'Foleon team' },
            { src: '/about/foleon-2.jpg', alt: 'Foleon product' },
            { src: '/about/foleon-3.jpg', alt: 'Foleon office' },
        ],
    },
    {
        id: 'thingscubed',
        period: '2020 — 2021 · Remote',
        role: 'Senior React Developer',
        company: 'ThingsCubed',
        body: 'Joined an IoT startup early stage. Owned the entire frontend — from architecture decisions to the last pixel. Rebuilt it from scratch under real constraints.',
        achievements: [
            'Migrated UI from DevExpress to React + Material UI',
            'Reduced page load time by ~90% through rendering optimisation',
            'Maintained frontend architecture docs for onboarding',
        ],
        tags: ['React', 'Material UI', 'IoT', 'Performance', 'Architecture'],
        highlights: ['React', 'Material UI'],
        decoNum: '02',
        photos: [
            { src: '/about/thingscubed-1.jpg', alt: 'ThingsCubed app' },
            { src: '/about/thingscubed-2.jpg', alt: 'ThingsCubed team' },
        ],
    },
    {
        id: 'spark',
        period: '2019 — 2020 · Tandil, AR',
        role: 'Software Engineer',
        company: 'Spark Digital',
        body: 'Accessibility point-of-contact on an educational chemistry simulation for Macmillan. Built complete keyboard navigation and screen reader support from scratch.',
        achievements: [
            'Led keyboard nav across the full application (NVDA, JAWS, VoiceOver)',
            'Built accessible UI patterns for a canvas-oriented product',
            'Presented to stakeholders and iterated on feedback until launch',
        ],
        tags: ['Accessibility', 'WCAG', 'React', 'Canvas', 'Education'],
        highlights: ['Accessibility', 'WCAG'],
        decoNum: '03',
        photos: [
            { src: '/about/spark-1.jpg', alt: 'Spark Digital project' },
            { src: '/about/spark-2.jpg', alt: 'Spark Digital team' },
        ],
    },
    {
        id: 'early',
        period: '2016 — 2019 · Remote / Tandil, AR',
        role: 'Web UI Developer',
        company: 'Globant & GlobalLogic',
        body: 'Consultancy years — fast context switching, many industries. Built everything from notification systems to landing page redesigns to a gamification framework.',
        achievements: [
            'Contributed to Reed.co.uk homepage redesign + A/B testing',
            'Built notification system for LA Galaxy (Angular)',
            'Greenfield back-office for Claro with React + Material UI',
            'Internal gamification framework — first real React project',
        ],
        tags: ['React', 'Angular', 'A/B Testing', 'CMS', 'Consultancy'],
        highlights: ['React'],
        decoNum: '04',
        photos: [
            { src: '/about/globant-1.jpg', alt: 'Globant office' },
            { src: '/about/globant-2.jpg', alt: 'Globant project' },
        ],
    },
    { id: 'next' },
]

const TOTAL = SECTIONS.length

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExperienceView() {
    const animating = useRef(false)
    const currentRef = useRef(0)
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
    const cursorRef = useRef<HTMLDivElement>(null)
    const cursorRingRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Lock body scroll on mount, restore on unmount
    useEffect(() => {
        document.body.classList.add('experience-page')
        return () => document.body.classList.remove('experience-page')
    }, [])

    const goTo = useCallback((idx: number) => {
        const cur = currentRef.current
        if (idx === cur || animating.current || idx < 0 || idx >= TOTAL) return
        animating.current = true

        const outEl = sectionRefs.current[cur]
        const inEl = sectionRefs.current[idx]
        if (!outEl || !inEl) return

        const goingForward = idx > cur
        const fromRight = idx % 2 === 1

        const inX = goingForward ? (fromRight ? '100%' : 0) : (fromRight ? '-100%' : 0)
        const inY = goingForward ? (fromRight ? 0 : '100%') : (fromRight ? 0 : '-100%')
        const outX = goingForward ? (fromRight ? '-40%' : 0) : (fromRight ? '100%' : 0)
        const outY = goingForward ? (fromRight ? 0 : '-40%') : (fromRight ? 0 : '100%')

        gsap.set(inEl, { x: inX, y: inY, opacity: 1, zIndex: 2, visibility: 'visible' })
        gsap.set(outEl, { zIndex: 1 })

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(outEl, { zIndex: 0, visibility: 'hidden' })
                animating.current = false
                currentRef.current = idx

                // Update counter DOM directly — no re-render
                const counter = document.getElementById('exp-counter')
                if (counter) counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`

                // Update hint arrow
                const hint = document.getElementById('exp-hint')
                if (hint) {
                    if (idx >= TOTAL - 1) {
                        hint.style.opacity = '0'
                    } else {
                        hint.style.opacity = ''
                        const arrow = document.getElementById('exp-hint-arrow')
                        if (arrow) arrow.textContent = idx + 1 % 2 === 1 ? '→' : '↓'
                    }
                }

                // Update dots
                document.querySelectorAll('[data-dot]').forEach((dot, i) => {
                    dot.classList.toggle(s.dotActive, i === idx)
                })
            },
        })

        tl.to(outEl, { x: outX, y: outY, opacity: 0.3, duration: 0.75, ease: 'power3.inOut' }, 0)
            .to(inEl, { x: 0, y: 0, opacity: 1, duration: 0.75, ease: 'power3.inOut' }, 0)

        const children = inEl.querySelectorAll('[data-animate]')
        gsap.fromTo(
            children,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
        )
    }, [])

    useGSAP(() => {
        // Position sections off-screen except first
        sectionRefs.current.forEach((el, i) => {
            if (!el || i === 0) return
            const fromRight = i % 2 === 1
            gsap.set(el, { x: fromRight ? '100%' : 0, y: fromRight ? 0 : '100%', opacity: 0, visibility: 'hidden' })
        })

        // Animate first section in
        const firstChildren = sectionRefs.current[0]?.querySelectorAll('[data-animate]')
        if (firstChildren) {
            gsap.fromTo(
                firstChildren,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
            )
        }

        // Cursor
        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursorRef.current, { left: e.clientX, top: e.clientY, duration: 0.05 })
            gsap.to(cursorRingRef.current, { left: e.clientX, top: e.clientY, duration: 0.18 })
        }

        // Scroll
        let wheelLock = false
        const onWheel = (e: WheelEvent) => {
            if (wheelLock || animating.current) return
            wheelLock = true
            setTimeout(() => { wheelLock = false }, 900)
            if (e.deltaY > 0) goTo(currentRef.current + 1)
            else goTo(currentRef.current - 1)
        }

        // Touch
        let touchStartY = 0
        const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
        const onTouchEnd = (e: TouchEvent) => {
            const diff = touchStartY - e.changedTouches[0].clientY
            if (Math.abs(diff) > 40) {
                if (diff > 0) goTo(currentRef.current + 1)
                else goTo(currentRef.current - 1)
            }
        }

        // Keyboard
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(currentRef.current + 1)
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(currentRef.current - 1)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchend', onTouchEnd)
        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchend', onTouchEnd)
            window.removeEventListener('keydown', onKeyDown)
        }
    }, { scope: containerRef, dependencies: [goTo] })

    return (
        <>
            {/* Custom cursor */}
            <div ref={cursorRef} className={s.cursor} />
            <div ref={cursorRingRef} className={s.cursorRing} />

            {/* Nav */}
            <nav className={s.nav}>
                <span id="exp-counter" className={s.counter}>
                    01 / {String(TOTAL).padStart(2, '0')}
                </span>
            </nav>

            {/* Progress dots */}
            <div className={s.progress}>
                {SECTIONS.map((_, i) => (
                    <button
                        key={i}
                        data-dot
                        className={`${s.dot} ${i === 0 ? s.dotActive : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to section ${i + 1}`}
                    />
                ))}
            </div>

            {/* Scroll hint */}
            <div id="exp-hint" className={s.hint}>
                <span id="exp-hint-arrow">↓</span>
                <span>scroll to explore</span>
            </div>

            {/* Viewport */}
            <div ref={containerRef} className={s.viewport}>

                {/* 0: Intro */}
                <div ref={el => { sectionRefs.current[0] = el }} className={`${s.section} ${s.s0}`}>
                    <div className={s.sectionInner}>
                        <div className={s.introLayout}>
                            <div>
                                <div className={s.label} data-animate>Experience</div>
                                <h1 className={s.heading} data-animate>
                                    Nine years<br />building the<br /><em>web.</em>
                                </h1>
                                <p className={s.body} data-animate>
                                    Senior Frontend Developer specialising in React &amp; TypeScript.
                                    From Buenos Aires to the Netherlands — always shipping.
                                </p>
                                <div className={s.tags} data-animate>
                                    {['React', 'TypeScript', 'Next.js', 'Accessibility', 'Testing'].map(t => (
                                        <span
                                            key={t}
                                            className={`${s.tag} ${['React', 'TypeScript', 'Next.js'].includes(t) ? s.tagHighlight : ''}`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={s.introRight} data-animate>
                                {[
                                    ['9+', 'Years of experience'],
                                    ['5', 'Companies & projects'],
                                    ['2', 'Countries'],
                                    ['∞', '🧉 Mate consumed'],
                                ].map(([num, label]) => (
                                    <div key={label} className={s.stat}>
                                        <span className={s.statNum}>{num}</span>
                                        <span className={s.statLabel}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className={s.decoNum}>00</span>
                    </div>
                </div>

                {/* 1–4: Work sections */}
                {SECTIONS.slice(1, -1).map((sec, i) => {
                    const idx = i + 1
                    const bgClass = s[`s${idx}` as keyof typeof s]
                    return (
                        <div
                            key={sec.id}
                            ref={el => { sectionRefs.current[idx] = el }}
                            className={`${s.section} ${bgClass}`}
                        >
                            <div className={s.sectionInner}>
                                <div className={s.workLayout}>
                                    <div className={s.workContent}>
                                        <div className={s.label} data-animate>{sec.period}</div>
                                        <h2 className={s.subheading} data-animate>
                                            <span className={s.year}>{sec.role}</span>
                                            {sec.company}
                                        </h2>
                                        <div className={s.rule} data-animate />
                                        <p className={s.body} data-animate>{sec.body}</p>
                                        <div className={s.achievements} data-animate>
                                            {sec.achievements?.map((a, j) => (
                                                <div key={j} className={s.achievement}>{a}</div>
                                            ))}
                                        </div>
                                        <div className={s.tags} data-animate>
                                            {sec.tags?.map(t => (
                                                <span
                                                    key={t}
                                                    className={`${s.tag} ${sec.highlights?.includes(t) ? s.tagHighlight : ''}`}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {sec.photos && (
                                        <div data-animate>
                                            <PolaroidStack photos={sec.photos} />
                                        </div>
                                    )}
                                </div>
                                <span className={s.decoNum}>{sec.decoNum}</span>
                            </div>
                        </div>
                    )
                })}

                {/* 5: What's next */}
                <div
                    ref={el => { sectionRefs.current[TOTAL - 1] = el }}
                    className={`${s.section} ${s.s5}`}
                >
                    <div className={`${s.sectionInner} ${s.centeredSection}`}>
                        <div className={s.label} data-animate style={{ justifyContent: 'center' }}>
                            What&apos;s next
                        </div>
                        <h1 className={s.heading} data-animate style={{ textAlign: 'center' }}>
                            Open to<br /><em>new challenges.</em>
                        </h1>
                        <p className={s.body} data-animate>
                            Looking for a senior frontend role where engineering is respected,
                            the team shares knowledge openly, and the product actually matters.
                        </p>
                        <div className={s.links} data-animate>
                            <a href="https://www.linkedin.com/in/sebastian-pellitero/" target="_blank" rel="noreferrer" className={s.link}>LinkedIn →</a>
                            <a href="https://github.com/SebastianPellitero" target="_blank" rel="noreferrer" className={s.link}>GitHub →</a>
                        </div>
                        <span
                            className={s.decoNum}
                            style={{ right: 'auto', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}
                        >
                            05
                        </span>
                    </div>
                </div>

            </div>
        </>
    )
}