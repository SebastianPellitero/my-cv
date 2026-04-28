'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function CasualFlow({ onDone }: { onDone: () => void }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.from('[data-casual-text]', { opacity: 0, y: 12, duration: 0.6 })
        gsap.to('[data-casual-text]', { opacity: 0, duration: 0.4, delay: 1.5, onComplete: onDone })
    }, { scope: ref })

    return (
        <div ref={ref} className="flex items-center justify-center h-full">
            <p
                data-casual-text
                className="font-['DM_Serif_Display',serif] text-3xl sm:text-5xl text-zinc-100"
            >
                Cool, enjoy. ✌
            </p>
        </div>
    )
}
