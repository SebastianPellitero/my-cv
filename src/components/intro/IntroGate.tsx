'use client'
import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import EntryScreen from './EntryScreen'
import ImpressFlow from './flows/ImpressFlow'

export type Flow = 'casual' | 'impress' | 'formal'
type IntroState = 'entry' | 'flow' | 'done' | 'fading'

const SEEN_KEY = 'intro-seen'
const subscribe = () => () => {}
// sessionStorage throws when storage is blocked; the intro then simply plays every time
const hasSeenIntro = () => {
    try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}

// Plays the intro over the home page once per browser session, then fades to reveal it.
export default function IntroGate({ children }: { children: React.ReactNode }) {
    const [step, setState] = useState<IntroState>('entry')
    const [flow, setFlow] = useState<Flow | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // shortcut: on a full reload the server-rendered overlay shows until React loads, then goes;
    // set the flag from an inline script before paint if that dark flash ever matters
    const seen = useSyncExternalStore(subscribe, hasSeenIntro, () => false)
    const state: IntroState = seen && step === 'entry' ? 'done' : step

    // Lock body scroll while intro is active, and keep Tab out of the nav bar the overlay covers
    useEffect(() => {
        const navBar = document.querySelector('header')
        document.body.style.overflow = (state === 'done') ? '' : 'hidden'
        navBar?.toggleAttribute('inert', state !== 'done')
        return () => {
            document.body.style.overflow = ''
            navBar?.removeAttribute('inert')
        }
    }, [state])

    // Sections further down fade in once, as they scroll into view (styles in globals.css).
    // Starts when the page is shown, so what is already on screen fades in with the reveal.
    const shown = state === 'fading' || state === 'done'
    useEffect(() => {
        if (!shown) return
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.setAttribute('data-inview', '')
                observer.unobserve(entry.target)
            }
        }, { threshold: 0.15 })
        contentRef.current?.querySelectorAll('[data-scroll-reveal]').forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [shown])

    const handleFlowSelect = (selected: Flow) => {
        // "Skip intro" goes straight to the page
        if (selected === 'casual') return handleDone()
        setFlow(selected)
        setState('flow')
    }

    function handleDone() {
        try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage blocked */ }
        setState('fading')
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => setState('done'),
        })

        // The page arrives in sequence as the overlay fades: name, rule, then the rest in reading order.
        // from() sets the start state right now, before the page becomes visible, so nothing flashes.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const q = gsap.utils.selector(contentRef)
        gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', clearProps: 'all' } })
            .from(q('[data-reveal="line"]'), { yPercent: 110, duration: 0.8, stagger: 0.1 })
            .from(q('[data-reveal="rule"]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '<0.3')
            .from(q('[data-reveal="fade"]'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, '<')
    }

    // Hover glow follows the mouse inside any [data-glow] box on the page (see the gradients in page.tsx)
    function trackGlow(e: React.PointerEvent) {
        if (e.pointerType !== 'mouse') return
        const box = (e.target as Element).closest<HTMLElement>('[data-glow]')
        if (!box) return
        const rect = box.getBoundingClientRect()
        box.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        box.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }

    return (
        <>
            {/* Visible from the start of the fade, so the overlay fades away to reveal it */}
            <div ref={contentRef} data-intro-content onPointerMove={trackGlow} style={{ visibility: state === 'done' || state === 'fading' ? 'visible' : 'hidden' }}>
                {children}
            </div>

            {(state === 'entry' || state === 'flow' || state === 'fading') && (
                <div
                    ref={overlayRef}
                    data-intro-overlay
                    className={`fixed inset-0 z-[100] bg-zinc-950 ${state === 'fading' ? 'pointer-events-none' : ''}`}
                >

                    {state === 'entry' && (
                        <EntryScreen onSelect={handleFlowSelect} />
                    )}

                    {state === 'flow' && (
                        <ImpressFlow formal={flow === 'formal'} onDone={handleDone} />
                    )}

                    {state !== 'fading' && (
                        <button
                            onClick={handleDone}
                            className="fixed bottom-6 right-6 z-[150]
                                       font-mono text-[0.6rem] tracking-[0.1em] uppercase
                                       text-zinc-600 hover:text-zinc-400 transition-colors duration-200
                                       cursor-pointer"
                            style={{ animation: 'fadeIn 0.4s ease 1s both' }}
                        >
                            Skip →
                        </button>
                    )}
                </div>
            )}

            {/* Without JS the intro can't be dismissed, so skip it and show the page */}
            <noscript>
                <style>{`
                    [data-intro-overlay] { display: none !important; }
                    [data-intro-content] { visibility: visible !important; }
                    [data-scroll-reveal] { opacity: 1 !important; translate: none !important; }
                `}</style>
            </noscript>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </>
    )
}
