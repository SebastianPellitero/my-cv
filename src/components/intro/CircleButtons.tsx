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

// Buttons orbit an ellipse centred on the heading (sm and up); on phones they stack below it
export default function CircleButtons({ onSelect }: { onSelect: (flow: Flow) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const btns = gsap.utils.toArray<HTMLElement>('[data-circle-btn]')

        gsap.from(btns, {
            opacity: 0,
            scale: 0.7,
            duration: 0.5,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            delay: 0.8,
        })

        gsap.matchMedia().add(
            { desktop: '(min-width: 640px)', motion: '(prefers-reduced-motion: no-preference)' },
            (ctx) => {
                const { desktop, motion } = ctx.conditions!
                if (!desktop) return

                // Ellipse wide enough to clear the heading, small enough to stay on screen
                const orbit = { t: 0 }
                const place = () => {
                    const rx = Math.min(360, window.innerWidth / 2 - 100)
                    const ry = Math.min(210, window.innerHeight / 2 - 60)
                    btns.forEach((el, i) => {
                        const a = (BUTTONS[i].angle * Math.PI) / 180 + orbit.t
                        gsap.set(el, { x: Math.cos(a) * rx, y: Math.sin(a) * ry, xPercent: -50, yPercent: -50 })
                    })
                }
                place()
                window.addEventListener('resize', place)
                if (!motion) return () => window.removeEventListener('resize', place)

                // Slow orbit; pauses while a button is hovered so it's easy to click
                const tween = gsap.to(orbit, { t: Math.PI * 2, duration: 40, repeat: -1, ease: 'none', onUpdate: place })
                const pause = () => tween.pause()
                const resume = () => tween.resume()
                btns.forEach((el) => {
                    el.addEventListener('mouseenter', pause)
                    el.addEventListener('mouseleave', resume)
                })
                return () => {
                    window.removeEventListener('resize', place)
                    btns.forEach((el) => {
                        el.removeEventListener('mouseenter', pause)
                        el.removeEventListener('mouseleave', resume)
                    })
                }
            },
        )
    }, { scope: containerRef })

    return (
        // `contents` on sm+: buttons position against EntryScreen, the same box that centres the heading
        <div ref={containerRef} className="flex w-full flex-col items-center gap-3 sm:contents">
            {BUTTONS.map((btn) => (
                <button
                    key={btn.id}
                    data-circle-btn
                    onClick={() => onSelect(btn.id)}
                    className="flex w-full max-w-[260px] items-center justify-center text-center
                               sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[180px]
                               px-5 py-3.5 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-100
                               shadow-lg shadow-black/50
                               hover:border-teal hover:bg-teal hover:text-zinc-950
                               font-mono text-xs tracking-[0.08em] uppercase leading-relaxed
                               transition-colors duration-200
                               whitespace-pre-line cursor-pointer"
                >
                    {btn.label}
                </button>
            ))}
        </div>
    )
}
