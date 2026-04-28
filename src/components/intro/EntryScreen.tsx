'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CircleButtons from './CircleButtons'
import type { Flow } from './IntroGate'

export default function EntryScreen({ onSelect }: { onSelect: (flow: Flow) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.from('[data-entry-msg]', {
            opacity: 0,
            y: 16,
            duration: 0.9,
            ease: 'power2.out',
        })
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center h-full gap-4">
            <div data-entry-msg className="text-center mb-16">
                <h1 className="font-['DM_Serif_Display',serif] text-4xl sm:text-5xl text-zinc-100 leading-tight">
                    Hey, glad you could make it.
                </h1>
                <p className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.15em] uppercase text-zinc-500 mt-3">
                    What brings you here?
                </p>
            </div>

            <CircleButtons onSelect={onSelect} />
        </div>
    )
}
