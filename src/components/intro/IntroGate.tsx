'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import EntryScreen from './EntryScreen'
import CasualFlow from './flows/CasualFlow'
import ImpressFlow from './flows/ImpressFlow'
import FormalFlow from './flows/FormalFlow'

export type Flow = 'casual' | 'impress' | 'formal'
type IntroState = 'entry' | 'flow' | 'done' | 'fading'

const STORAGE_KEY = 'intro-seen'

export default function IntroGate({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<IntroState>('entry')
    const [flow, setFlow] = useState<Flow | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Skip on repeat visits
    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEY)) {
            setState('done')
        }
    }, [])

    // Lock body scroll while intro is active
    useEffect(() => {
        document.body.style.overflow = (state === 'done') ? '' : 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [state])

    const handleFlowSelect = (selected: Flow) => {
        setFlow(selected)
        setState('flow')
    }

    const handleDone = () => {
        localStorage.setItem(STORAGE_KEY, '1')
        setState('fading')
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => setState('done'),
        })
    }

    return (
        <>
            <div style={{ visibility: state === 'done' ? 'visible' : 'hidden' }}>
                {children}
            </div>

            {(state === 'entry' || state === 'flow' || state === 'fading') && (
                <div ref={overlayRef} className="fixed inset-0 z-[100] bg-zinc-950">

                    {state === 'entry' && (
                        <EntryScreen onSelect={handleFlowSelect} />
                    )}

                    {state === 'flow' && flow === 'casual' && (
                        <CasualFlow onDone={handleDone} />
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
                                       font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.1em] uppercase
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
