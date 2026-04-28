'use client'

export default function ImpressBar({ progress }: { progress: number }) {
    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-zinc-800">
            <div
                className="h-full bg-teal"
                style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
            />
        </div>
    )
}
