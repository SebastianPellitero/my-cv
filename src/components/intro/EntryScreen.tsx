'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CircleButtons from './CircleButtons'
import type { Flow } from './IntroGate'

export default function EntryScreen({ onSelect }: { onSelect: (flow: Flow) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Animates *to* visible — the markup renders hidden so the first paint is already correct
    useGSAP(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // See CircleButtons: Tailwind v4's `translate:` composes with GSAP's `transform`,
        // so hand the transform to GSAP and re-seed the offset it animates from.
        gsap.set('[data-entry-msg]', { clearProps: 'translate', y: 16 })

        gsap.to('[data-entry-msg]', {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 0.9,
            ease: 'power2.out',
        })
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative flex flex-col items-center justify-center h-full gap-10 px-6">
            <div
                data-entry-msg
                className="text-center opacity-0 translate-y-4
                           motion-reduce:opacity-100 motion-reduce:translate-y-0"
            >
                <h1 className="font-serif text-3xl sm:text-4xl text-zinc-100 leading-tight">
                    Hey, glad you could make it.
                </h1>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-zinc-500 mt-3">
                    What brings you here?
                </p>
            </div>

            <CircleButtons onSelect={onSelect} />
        </div>
    )
}
