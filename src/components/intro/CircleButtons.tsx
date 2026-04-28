'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Flow } from './IntroGate'

type Button = { id: Flow; label: string; angle: number }

const BUTTONS: Button[] = [
    { id: 'impress', label: "I'm here to see\nif I'll hire you", angle: 270 },
    { id: 'casual', label: 'Just browsing', angle: 30 },
    { id: 'formal', label: "Let's be formal\nabout this", angle: 150 },
]

const RADIUS = 180

export default function CircleButtons({ onSelect }: { onSelect: (flow: Flow) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const btns = Array.from(
            containerRef.current!.querySelectorAll<HTMLElement>('[data-circle-btn]')
        )

        // Position each button on the ring via GSAP (so rotation + position coexist in one matrix)
        btns.forEach((el, i) => {
            const rad = (BUTTONS[i].angle * Math.PI) / 180
            gsap.set(el, {
                x: Math.cos(rad) * RADIUS,
                y: Math.sin(rad) * RADIUS,
                xPercent: -50,
                yPercent: -50,
            })
        })

        // Initial stagger fade-in
        gsap.from(btns, {
            opacity: 0,
            scale: 0.7,
            duration: 0.5,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            delay: 0.8,
        })

        // Slow orbit: ring rotates, each button counter-rotates to keep text upright
        gsap.to(ringRef.current, { rotation: 360, duration: 30, repeat: -1, ease: 'none' })
        gsap.to(btns, { rotation: -360, duration: 30, repeat: -1, ease: 'none' })
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative" style={{ width: 0, height: 0 }}>
            <div ref={ringRef} className="absolute">
                {BUTTONS.map((btn) => (
                    <button
                        key={btn.id}
                        data-circle-btn
                        onClick={() => onSelect(btn.id)}
                        className="absolute flex items-center justify-center text-center
                                   w-[150px] px-4 py-3 rounded-sm border
                                   border-zinc-700 text-zinc-300 bg-zinc-900/70
                                   hover:border-teal hover:text-teal
                                   font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.08em] uppercase leading-relaxed
                                   transition-colors duration-200 backdrop-blur-sm
                                   whitespace-pre-line cursor-pointer"
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
