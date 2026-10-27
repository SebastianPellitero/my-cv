'use client'
import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ImpressBar from '../shared/ImpressBar'
import OrbitRing from '../shared/OrbitRing'
import { skills, companies, learning } from '@/data/intro'

type Props = {
    formal?: boolean
    onDone: () => void
}

const copy = {
    default: {
        s1: 'Ok, let me try to impress you.',
        s2: 'These are the technologies I work with.',
        s3: "And these are the companies I've built with.",
        s4_label: "What I'm working on right now.",
        s4: '9+ years of shipping products people actually use.',
        cta: "Convinced? Let's go →",
    },
    formal: {
        s1: 'Allow me to present my qualifications.',
        s2: 'Technical proficiencies.',
        s3: 'Professional experience.',
        s4_label: 'Current professional development.',
        s4: 'Nine years delivering products at scale, across three countries.',
        cta: "Let's proceed →",
    },
}

function TieIcon() {
    return (
        <svg
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-zinc-500 mx-auto mb-4"
        >
            <path d="M12 2L9.5 8 12 10l2.5-2L12 2z" />
            <path d="M9.5 8L7 20l5-2.5L17 20l-2.5-12" />
        </svg>
    )
}

// Outermost first: technologies wrap everything, then companies, then what I'm learning now.
// Inner radius keeps its items clear of the 240px centre text.
const STAGE = 880
const SKILLS_RADIUS = 380
const COMPANIES_RADIUS = 270
const LEARNING_RADIUS = 185
const LAST_STEP = 5 // 0 opening line · 1 skills · 2 companies · 3 learning · 4 statement · 5 CTA

export default function ImpressFlow({ formal = false, onDone }: Props) {
    const stageRef = useRef<HTMLDivElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const [ringScale, setRingScale] = useState(1)

    const c = formal ? copy.formal : copy.default
    const textClass = formal
        ? 'font-serif text-stone-100'
        : "font-serif text-zinc-100"
    const bgClass = formal ? 'bg-neutral-950' : 'bg-zinc-950'
    const labelClass = 'font-mono text-[13px] tracking-[0.15em] uppercase text-teal leading-relaxed'

    // Fit the stage into small viewports, and refit on resize / rotation
    // shortcut: on phones everything scales down together (~0.4x), so centre text gets small; give it its own mobile layout if phones matter
    useEffect(() => {
        const fit = () => setRingScale(Math.min(1, (Math.min(window.innerWidth, window.innerHeight) - 40) / STAGE))
        fit()
        window.addEventListener('resize', fit)
        return () => window.removeEventListener('resize', fit)
    }, [])

    useGSAP(() => {
        const bar = '[data-impress-bar]'
        const skillItems = '[data-orbit-item="skills"]'
        const companyItems = '[data-orbit-item="companies"]'
        const learningItems = '[data-orbit-item="learning"]'

        gsap.set([skillItems, companyItems, learningItems].join(', '), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
        gsap.set('[data-center], [data-hint]', { autoAlpha: 0, y: 8 })

        // One paused timeline with a label per step; input tweens the playhead to the next or previous label
        const tl = gsap.timeline({ paused: true })
        tlRef.current = tl

        const showRing = (items: string) =>
            tl.to(items, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.6)' }, '-=0.2')
        const swapText = (from: string, to: string) => {
            tl.to(from, { autoAlpha: 0, y: -8, duration: 0.35 })
            tl.to(to, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.2')
        }
        const progress = (step: number) => tl.to(bar, { scaleX: step / LAST_STEP, duration: 0.6, ease: 'power2.out' }, '<')

        tl.to('[data-center="s1"]', { autoAlpha: 1, y: 0, duration: 1 }, 0.3)
        tl.to('[data-hint]', { autoAlpha: 1, y: 0, duration: 0.6 }, '>0.2')
        tl.addLabel('step0')

        swapText('[data-center="s1"]', '[data-center="s2"]')
        progress(1)
        showRing(skillItems)
        tl.addLabel('step1')

        swapText('[data-center="s2"]', '[data-center="s3"]')
        progress(2)
        showRing(companyItems)
        tl.addLabel('step2')

        swapText('[data-center="s3"]', '[data-center="s4_label"]')
        progress(3)
        showRing(learningItems)
        tl.addLabel('step3')

        tl.to('[data-ring]', { opacity: 0.2, duration: 0.6 })
        swapText('[data-center="s4_label"]', '[data-center="s4"]')
        progress(4)
        tl.addLabel('step4')

        tl.to('[data-center="cta"]', { autoAlpha: 1, y: 0, duration: 0.5 })
        tl.to('[data-hint]', { autoAlpha: 0, duration: 0.3 }, '<')
        progress(5)
        tl.addLabel('step5')

        tl.tweenTo('step0')

        // Slow orbit; items counter-spin at the same speed so each logo stays upright above its name
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            const orbit = { repeat: -1, ease: 'none' }
            gsap.to('[data-ring="skills"]', { rotation: 360, duration: 120, ...orbit })
            gsap.to(skillItems, { rotation: -360, duration: 120, ...orbit })
            gsap.to('[data-ring="companies"]', { rotation: -360, duration: 80, ...orbit })
            gsap.to(companyItems, { rotation: 360, duration: 80, ...orbit })
            gsap.to('[data-ring="learning"]', { rotation: 360, duration: 60, ...orbit })
            gsap.to(learningItems, { rotation: -360, duration: 60, ...orbit })
        })
    }, { scope: stageRef, dependencies: [] })

    // Scroll / swipe / key down or click: next step. Scroll / swipe / key up: previous step.
    useEffect(() => {
        let step = 0
        let moving: gsap.core.Tween | null = null
        const go = (dir: 1 | -1) => {
            const tl = tlRef.current
            const target = step + dir
            // Ignore input while the opening line or a step is still playing
            if (!tl || tl.time() < tl.labels.step0 || moving?.isActive() || target < 0 || target > LAST_STEP) return
            step = target
            moving = tl.tweenTo(`step${step}`)
        }

        // A trackpad flick fires a stream of wheel events; only the first of a burst counts
        let lastWheel = 0
        const onWheel = (e: WheelEvent) => {
            const now = performance.now()
            const fresh = now - lastWheel > 250
            lastWheel = now
            if (fresh && e.deltaY !== 0) go(e.deltaY > 0 ? 1 : -1)
        }
        let touchY = 0
        const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
        const onTouchEnd = (e: TouchEvent) => {
            const dy = touchY - e.changedTouches[0].clientY
            if (Math.abs(dy) > 40) go(dy > 0 ? 1 : -1)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLButtonElement) return
            const dir = ['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key) ? 1
                : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0
            if (dir) {
                e.preventDefault()
                go(dir)
            }
        }
        const onClick = () => go(1)

        const stage = stageRef.current!
        stage.addEventListener('click', onClick)
        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })
        window.addEventListener('keydown', onKey)
        return () => {
            stage.removeEventListener('click', onClick)
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchend', onTouchEnd)
            window.removeEventListener('keydown', onKey)
        }
    }, [])

    return (
        <div
            ref={stageRef}
            className={`fixed inset-0 z-[100] overflow-hidden select-none cursor-pointer ${bgClass}`}
        >
            {formal && (
                <div
                    className="pointer-events-none fixed inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(90deg, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 1px, transparent 1px, transparent 8px)',
                    }}
                />
            )}

            <ImpressBar />

            <div className="absolute inset-0 flex items-center justify-center">
                {/* Square stage: rings + centre text, scaled as one for smaller viewports */}
                <div
                    className="relative flex-shrink-0"
                    style={{ width: STAGE, height: STAGE, transform: `scale(${ringScale})`, transformOrigin: 'center center' }}
                >
                    <OrbitRing name="skills" items={skills} radius={SKILLS_RADIUS} size={STAGE} />
                    <OrbitRing name="companies" items={companies} radius={COMPANIES_RADIUS} size={STAGE} />
                    <OrbitRing name="learning" items={learning} radius={LEARNING_RADIUS} size={STAGE} />

                    {/* Centre text — one block per step, GSAP crossfades between them */}
                    <div aria-live="polite" className="absolute inset-0 flex items-center justify-center text-center">
                        <div data-center="s1" className="absolute w-[520px]">
                            {formal && <TieIcon />}
                            <h2 className={`${textClass} text-5xl leading-tight`}>{c.s1}</h2>
                        </div>
                        <p data-center="s2" className={`absolute w-[240px] ${labelClass}`}>{c.s2}</p>
                        <p data-center="s3" className={`absolute w-[240px] ${labelClass}`}>{c.s3}</p>
                        <p data-center="s4_label" className={`absolute w-[240px] ${labelClass}`}>{c.s4_label}</p>
                        {/* Statement + CTA stacked; GSAP owns their transforms, so layout comes from flex, not translate */}
                        <div className="absolute w-[300px] flex flex-col items-center gap-8">
                            <p data-center="s4" className={`${textClass} text-2xl leading-snug`}>{c.s4}</p>
                            <button
                                data-center="cta"
                                onClick={(e) => { e.stopPropagation(); onDone() }}
                                className="font-mono text-[0.75rem] tracking-[0.15em] uppercase
                                           px-8 py-4 border border-teal text-teal bg-zinc-950
                                           hover:bg-teal hover:text-zinc-900
                                           transition-colors duration-300 cursor-pointer"
                            >
                                {c.cta}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p
                data-hint
                className="pointer-events-none invisible absolute bottom-8 inset-x-0 text-center
                           font-mono text-xs tracking-[0.15em] uppercase text-zinc-500"
            >
                Scroll or click ↓ · scroll up to go back
            </p>
        </div>
    )
}
