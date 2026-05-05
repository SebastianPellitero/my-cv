import { thirdRingItems } from '@/data/intro'

export default function ThirdRing({ radius = 315 }: { radius?: number }) {
    void radius // radius is applied via GSAP in ImpressFlow
    return (
        <div data-third-ring className="absolute inset-0">
            {thirdRingItems.map((item) => (
                <div
                    key={item.id}
                    data-third-item
                    className="absolute"
                    style={{ top: '50%', left: '50%' }}
                >
                    <div className="px-3 py-1.5 rounded-sm border border-zinc-800 bg-zinc-900/60 whitespace-nowrap">
                        <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.08em] uppercase text-zinc-600">
                            {item.label || '·'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
