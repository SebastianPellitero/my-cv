'use client'
import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import EntryScreen from './EntryScreen'
import CasualFlow from './flows/CasualFlow'
import ImpressFlow from './flows/ImpressFlow'
import FormalFlow from './flows/FormalFlow'

export type Flow = 'casual' | 'impress' | 'formal'
type IntroState = 'entry' | 'flow' | 'done'

const STORAGE_KEY = 'intro-seen'

export default function IntroGate({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<IntroState>('entry')
    const [flow, setFlow] = useState<Flow | null>(null)
    const [visible, setVisible] = useState(true)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Skip on repeat visits
    useEffect(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) {
            setState('done')
        }
    }, [])

    // Lock body scroll while intro is active
    useEffect(() => {
        if (state !== 'done') {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [state])

    useGSAP(() => {
        if (state === 'done' && overlayRef.current) {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => setVisible(false),
            })
        }
    }, { scope: overlayRef, dependencies: [state] })

    const handleFlowSelect = (selected: Flow) => {
        setFlow(selected)
        setState('flow')
    }

    const handleDone = () => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, '1')
        }
        setState('done')
    }

    return (
        <>
            {/* Real page — always mounted, visible once intro is done */}
            <div style={{ visibility: state === 'done' ? 'visible' : 'hidden' }}>
                {children}
            </div>

            {/* Intro overlay */}
            {visible && state !== 'done' && (
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

                    {/* Skip button */}
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
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </>
    )
}
