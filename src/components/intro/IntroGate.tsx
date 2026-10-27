'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import EntryScreen from './EntryScreen'
import ImpressFlow from './flows/ImpressFlow'
import FormalFlow from './flows/FormalFlow'

export type Flow = 'casual' | 'impress' | 'formal'
type IntroState = 'entry' | 'flow' | 'done' | 'fading'

// Plays the intro over the home page on every visit, then fades to reveal it.
export default function IntroGate({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<IntroState>('entry')
    const [flow, setFlow] = useState<Flow | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Lock body scroll while intro is active
    useEffect(() => {
        document.body.style.overflow = (state === 'done') ? '' : 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [state])

    const handleFlowSelect = (selected: Flow) => {
        // "Just browsing" goes straight to the page
        if (selected === 'casual') return handleDone()
        setFlow(selected)
        setState('flow')
    }

    function handleDone() {
        setState('fading')
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => setState('done'),
        })
    }

    return (
        <>
            {/* Visible from the start of the fade, so the overlay fades away to reveal it */}
            <div style={{ visibility: state === 'done' || state === 'fading' ? 'visible' : 'hidden' }}>
                {children}
            </div>

            {(state === 'entry' || state === 'flow' || state === 'fading') && (
                <div
                    ref={overlayRef}
                    className={`fixed inset-0 z-[100] bg-zinc-950 ${state === 'fading' ? 'pointer-events-none' : ''}`}
                >

                    {state === 'entry' && (
                        <EntryScreen onSelect={handleFlowSelect} />
                    )}

                    {state === 'flow' && flow === 'impress' && (
                        <ImpressFlow onDone={handleDone} />
                    )}

                    {state === 'flow' && flow === 'formal' && (
                        <FormalFlow onDone={handleDone} />
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

            {/* Without JS the intro can't animate or be dismissed, so reveal it unanimated */}
            <noscript>
                <style>{`
                    [data-entry-msg], [data-circle-btn] {
                        opacity: 1 !important;
                        transform: none !important;
                    }
                `}</style>
            </noscript>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </>
    )
}
