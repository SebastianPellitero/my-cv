'use client'

// Width is animated by ImpressFlow's ScrollTrigger via [data-impress-bar]
export default function ImpressBar() {
    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-zinc-800">
            <div data-impress-bar className="h-full bg-teal origin-left scale-x-0" />
        </div>
    )
}
