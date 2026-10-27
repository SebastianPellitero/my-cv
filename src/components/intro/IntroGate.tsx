'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import EntryScreen from './EntryScreen'
import ImpressFlow from './flows/ImpressFlow'
import FormalFlow from './flows/FormalFlow'

export type Flow = 'casual' | 'impress' | 'formal'
type IntroState = 'entry' | 'flow' | 'done' | 'fading'

const STORAGE_KEY = 'intro-seen'

// alwaysShow: ignore and don't write `intro-seen`. finishHref: after the fade, replace the URL with this route.
// Both are used by /intro, which plays the intro over the home page and then lands on "/".
export default function IntroGate({ children, alwaysShow = false, finishHref }: {
    children: React.ReactNode
    alwaysShow?: boolean
    finishHref?: string
}) {
    const router = useRouter()
    const [state, setState] = useState<IntroState>('entry')
    const [flow, setFlow] = useState<Flow | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Skip on repeat visits — layout effect so the intro never paints first
    useLayoutEffect(() => {
        if (alwaysShow) return
        try {
            if (localStorage.getItem(STORAGE_KEY)) {
                setState('done')
            }
        } catch { } // storage blocked: just show the intro
    }, [alwaysShow])

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
        if (!alwaysShow) {
            try {
                localStorage.setItem(STORAGE_KEY, '1')
            } catch { } // storage blocked: intro shows again next visit
        }
        setState('fading')
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setState('done')
                // replace, so Back doesn't return to the intro
                if (finishHref) router.replace(finishHref)
            },
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

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </>
    )
}
