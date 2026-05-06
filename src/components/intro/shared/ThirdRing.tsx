import { thirdRingItems } from '@/data/intro'

function getArcOffset(i: number, total: number): { isTop: boolean; startOffset: string } {
    let angle = (i / total) * 2 * Math.PI - Math.PI / 2
    while (angle >= Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    const isTop = angle < 0
    const offset = isTop ? (angle + Math.PI) / Math.PI : angle / Math.PI
    return { isTop, startOffset: `${(offset * 100).toFixed(2)}%` }
}

export default function ThirdRing({ radius = 315 }: { radius?: number }) {
    const cx = 350
    const cy = 350
    const textR = radius + 14
    const topArc    = `M ${cx - textR},${cy} A ${textR},${textR} 0 0,1 ${cx + textR},${cy}`
    const bottomArc = `M ${cx + textR},${cy} A ${textR},${textR} 0 0,1 ${cx - textR},${cy}`

    return (
        <svg
            data-third-ring
            viewBox="0 0 700 700"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <path id="third-top-arc"    d={topArc} />
                <path id="third-bottom-arc" d={bottomArc} />
            </defs>

            {thirdRingItems.map((item, i) => {
                const angle = (i / thirdRingItems.length) * 2 * Math.PI - Math.PI / 2
                const ix = cx + Math.cos(angle) * radius
                const iy = cy + Math.sin(angle) * radius

                return (
                    <g key={item.id} data-third-item>
                        <g transform={`translate(${ix},${iy})`}>
                            <circle r="2" fill="#3f3f46" opacity="0.6" />
                        </g>
                    </g>
                )
            })}

            {thirdRingItems.map((item, i) => {
                if (!item.label) return null
                const { isTop, startOffset } = getArcOffset(i, thirdRingItems.length)
                return (
                    <text
                        key={`label-${item.id}`}
                        data-third-label
                        fontFamily="DM Mono, monospace"
                        fontSize="8"
                        letterSpacing="1.5"
                        fill="#27272a"
                        textAnchor="middle"
                    >
                        <textPath
                            href={isTop ? '#third-top-arc' : '#third-bottom-arc'}
                            startOffset={startOffset}
                        >
                            {item.label.toUpperCase()}
                        </textPath>
                    </text>
                )
            })}
        </svg>
    )
}
