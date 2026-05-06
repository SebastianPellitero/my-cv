'use client'
import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImpressBar from '../shared/ImpressBar'
import SkillsRing from '../shared/SkillsRing'
import ProjectsRing from '../shared/ProjectsRing'
import ThirdRing from '../shared/ThirdRing'
import { skills, introProjects, thirdRingItems } from '@/data/intro'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    formal?: boolean
    onDone: () => void
}

const copy = {
    default: {
        s1: 'Ok, let me try to impress you.',
        s2: 'These are the technologies I work with.',
        s3: "And these are some of the things I've built.",
        s4_label: "What I'm learning next.",
        s4: '9+ years of shipping products people actually use.',
        cta: "Convinced? Let's go →",
    },
    formal: {
        s1: 'Allow me to present my qualifications.',
        s2: 'Technical proficiencies.',
        s3: 'Selected works.',
        s4_label: 'Future development areas.',
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

const SKILLS_RADIUS = 120
const PROJECTS_RADIUS = 215
const THIRD_RADIUS = 315

export default function ImpressFlow({ formal = false, onDone }: Props) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const allRingsRef = useRef<HTMLDivElement>(null)
    const s2Ref = useRef<HTMLParagraphElement>(null)
    const s3Ref = useRef<HTMLParagraphElement>(null)
    const s4LabelRef = useRef<HTMLParagraphElement>(null)
    const [progress, setProgress] = useState(0)

    const c = formal ? copy.formal : copy.default
    const textClass = formal
        ? 'font-serif text-stone-100'
        : "font-['DM_Serif_Display',serif] text-zinc-100"
    const bgClass = formal ? 'bg-neutral-950' : 'bg-zinc-950'

    // Progress bar via native scroll
    useEffect(() => {
        const el = scrollerRef.current!
        const onScroll = () => {
            const max = el.scrollHeight - el.clientHeight
            if (max > 0) setProgress(el.scrollTop / max)
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [])

    useGSAP(() => {
        const scroller = scrollerRef.current!
        const vh = window.innerHeight

        // Section 1: animate text in on mount
        gsap.from('[data-s1]', { opacity: 0, y: 20, duration: 1, delay: 0.3 })

        // All labels start hidden — GSAP owns their opacity
        gsap.set(s2Ref.current, { opacity: 0, y: 8 })
        gsap.set(s3Ref.current, { opacity: 0, y: 8 })
        gsap.set(s4LabelRef.current, { opacity: 0, y: 8 })

        // --- Skill items ---
        const skillEls = gsap.utils.toArray<Element>('[data-skill-item]')
        const skillLabelEls = gsap.utils.toArray<Element>('[data-skill-label]')
        gsap.set(skillEls, { opacity: 0 })
        gsap.set(skillLabelEls, { opacity: 0 })

        // --- Project items ---
        const projectEls = gsap.utils.toArray<Element>('[data-project-item]')
        const projectLabelEls = gsap.utils.toArray<Element>('[data-project-label]')
        gsap.set(projectEls, { opacity: 0 })
        gsap.set(projectLabelEls, { opacity: 0 })

        // --- Third ring items ---
        const thirdEls = gsap.utils.toArray<Element>('[data-third-item]')
        const thirdLabelEls = gsap.utils.toArray<Element>('[data-third-label]')
        gsap.set(thirdEls, { opacity: 0 })
        gsap.set(thirdLabelEls, { opacity: 0 })

        // --- Skills scroll-scrub: appear 0–300vh ---
        const skillsTl = gsap.timeline({
            scrollTrigger: {
                scroller,
                trigger: allRingsRef.current,
                start: 'top top',
                end: `+=${vh * 3}`,
                scrub: 0.5,
            },
        })
        skillEls.forEach((el, i) => {
            skillsTl.to(el, { opacity: 1, duration: 0.5 }, i * (2.5 / skills.length))
        })
        skillsTl.to(skillLabelEls, { opacity: 1, duration: 0.5, stagger: 0.05 }, 2.5)

        // Fade s2 label in when rings section enters
        ScrollTrigger.create({
            scroller,
            trigger: allRingsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: () => {
                gsap.to(s2Ref.current, { opacity: 1, y: 0, duration: 0.6 })
            },
        })

        // --- Projects scroll-scrub: appear 300–600vh + label crossfade ---
        ScrollTrigger.create({
            scroller,
            trigger: allRingsRef.current,
            start: `top+=${vh * 3} top`,
            onEnter: () => {
                gsap.to(s2Ref.current, { opacity: 0, y: -8, duration: 0.4 })
                gsap.to(s3Ref.current, { opacity: 1, y: 0, duration: 0.4 })
            },
            onLeaveBack: () => {
                gsap.to(s2Ref.current, { opacity: 1, y: 0, duration: 0.4 })
                gsap.to(s3Ref.current, { opacity: 0, y: 8, duration: 0.4 })
            },
        })

        const projectsTl = gsap.timeline({
            scrollTrigger: {
                scroller,
                trigger: allRingsRef.current,
                start: `top+=${vh * 3} top`,
                end: `+=${vh * 3}`,
                scrub: 0.5,
            },
        })
        projectEls.forEach((el, i) => {
            projectsTl.to(el, { opacity: 1, duration: 0.5 }, i * (2.5 / introProjects.length))
        })
        projectsTl.to(projectLabelEls, { opacity: 1, duration: 0.5, stagger: 0.05 }, 2.5)

        // --- Third ring scroll-scrub: appear 600–900vh + label crossfade ---
        ScrollTrigger.create({
            scroller,
            trigger: allRingsRef.current,
            start: `top+=${vh * 6} top`,
            onEnter: () => {
                gsap.to(s3Ref.current, { opacity: 0, y: -8, duration: 0.4 })
                gsap.to(s4LabelRef.current, { opacity: 1, y: 0, duration: 0.4 })
            },
            onLeaveBack: () => {
                gsap.to(s3Ref.current, { opacity: 1, y: 0, duration: 0.4 })
                gsap.to(s4LabelRef.current, { opacity: 0, y: 8, duration: 0.4 })
            },
        })

        const thirdTl = gsap.timeline({
            scrollTrigger: {
                scroller,
                trigger: allRingsRef.current,
                start: `top+=${vh * 6} top`,
                end: `+=${vh * 3}`,
                scrub: 0.5,
            },
        })
        thirdEls.forEach((el, i) => {
            thirdTl.to(el, { opacity: 1, duration: 0.5 }, i * (2.5 / thirdRingItems.length))
        })
        thirdTl.to(thirdLabelEls, { opacity: 1, duration: 0.5, stagger: 0.05 }, 2.5)

        // --- Continuous orbital rotation — SVGs rotate around their center (350,350) ---
        // Items travel with the ring; arc text readability is baked into SVG textPath structure
        gsap.to('[data-skills-ring]',   { rotation: 360,  duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
        gsap.to('[data-projects-ring]', { rotation: -360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
        gsap.to('[data-third-ring]',    { rotation: 360,  duration: 45, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })

        // --- Section 4 + CTA ---
        gsap.from('[data-s4]', {
            opacity: 0, y: 12, duration: 0.8,
            scrollTrigger: {
                scroller,
                trigger: '[data-s4-section]',
                start: 'top 70%',
                toggleActions: 'play none none none',
            },
        })

        gsap.from('[data-cta]', {
            opacity: 0, y: 20, duration: 0.8,
            scrollTrigger: {
                scroller,
                trigger: '[data-cta-section]',
                start: 'top 70%',
                toggleActions: 'play none none none',
            },
        })
    }, { scope: scrollerRef, dependencies: [] })

    return (
        <div
            ref={scrollerRef}
            className={`fixed inset-0 overflow-y-auto z-[100] ${bgClass}`}
            style={{ overscrollBehavior: 'contain' }}
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

            <ImpressBar progress={progress} />

            {/* Section 1 — intro text */}
            <div className={`h-screen flex items-center justify-center px-8 ${bgClass}`}>
                <div data-s1 className="text-center max-w-lg">
                    {formal && <TieIcon />}
                    <h2 className={`${textClass} text-3xl sm:text-5xl leading-tight`}>{c.s1}</h2>
                </div>
            </div>

            {/* Sections 2 + 3 + 4-label — rings (900vh) */}
            <div ref={allRingsRef} className={bgClass} style={{ height: '900vh' }}>
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8 px-8 overflow-hidden">

                    {/* Label — GSAP crossfade between s2, s3, and s4_label */}
                    <div className="relative h-6 flex items-center justify-center">
                        <p
                            ref={s2Ref}
                            className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.15em] uppercase text-teal absolute opacity-0"
                        >
                            {c.s2}
                        </p>
                        <p
                            ref={s3Ref}
                            className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.15em] uppercase text-teal absolute opacity-0"
                        >
                            {c.s3}
                        </p>
                        <p
                            ref={s4LabelRef}
                            className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.15em] uppercase text-teal absolute opacity-0"
                        >
                            {c.s4_label}
                        </p>
                    </div>

                    {/* Rings container — 700×700, scaled for smaller viewports */}
                    <div
                        className="relative flex-shrink-0"
                        style={{
                            width: 700,
                            height: 700,
                            transform: `scale(${typeof window !== 'undefined' ? Math.min(1, (Math.min(window.innerWidth, window.innerHeight) - 80) / 700) : 1})`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <SkillsRing radius={SKILLS_RADIUS} />
                        <ProjectsRing radius={PROJECTS_RADIUS} />
                        <ThirdRing radius={THIRD_RADIUS} />
                    </div>
                </div>
            </div>

            {/* Section 4 — placeholder statement */}
            <div data-s4-section className={`h-screen flex items-center justify-center px-8 ${bgClass}`}>
                <p data-s4 className={`${textClass} text-3xl sm:text-4xl text-center max-w-xl leading-snug`}>
                    {c.s4}
                </p>
            </div>

            {/* Final — CTA */}
            <div data-cta-section className={`h-screen flex items-center justify-center ${bgClass}`}>
                <button
                    data-cta
                    onClick={onDone}
                    className="font-['DM_Mono',monospace] text-[0.75rem] tracking-[0.15em] uppercase
                               px-8 py-4 border border-teal text-teal
                               hover:bg-teal hover:text-zinc-900
                               transition-colors duration-300 cursor-pointer"
                >
                    {c.cta}
                </button>
            </div>
        </div>
    )
}
