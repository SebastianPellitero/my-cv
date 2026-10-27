import type { OrbitItem } from '@/data/intro'

const ICON = 40

// Near-black brand colours (Next.js, Ollama, Angular…) vanish on the dark stage
function iconFill(hex: string) {
    const n = parseInt(hex, 16)
    const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
    return lum < 60 ? '#e4e4e7' : `#${hex}`
}

function Logo({ item }: { item: OrbitItem }) {
    if (item.icon) {
        return (
            <svg viewBox="0 0 24 24" width={ICON} height={ICON} aria-hidden>
                <path d={item.icon.path} fill={iconFill(item.icon.hex)} />
            </svg>
        )
    }
    if (item.img) {
        // light tile: some site icons (Globant) are dark-on-transparent
        // eslint-disable-next-line @next/next/no-img-element -- tiny static icons, no optimisation needed
        return <img src={item.img} alt="" height={ICON} className="h-10 w-auto max-w-[88px] object-contain rounded-md bg-zinc-100 p-0.5" />
    }
    return (
        <span
            className="flex items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-200"
            style={{ width: ICON, height: ICON }}
        >
            {item.abbr}
        </span>
    )
}

// Items sit on a circle; ImpressFlow spins the ring and counter-spins each item so logo + name stay upright
export default function OrbitRing({ name, items, radius, size }: {
    name: string
    items: OrbitItem[]
    radius: number
    size: number
}) {
    const c = size / 2
    return (
        <div data-ring={name} className="absolute inset-0">
            {items.map((item, i) => {
                const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2
                return (
                    <div
                        key={item.label}
                        className="absolute"
                        style={{
                            left: c + Math.cos(angle) * radius,
                            top: c + Math.sin(angle) * radius,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <div data-orbit-item={name} className="flex w-[92px] flex-col items-center gap-1.5">
                            <Logo item={item} />
                            <span className="text-center font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-zinc-400">
                                {item.label}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
