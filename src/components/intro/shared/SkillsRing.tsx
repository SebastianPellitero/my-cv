import { skills } from '@/data/intro'

export default function SkillsRing({ radius = 120 }: { radius?: number }) {
    return (
        <div className="absolute inset-0">
            {skills.map((skill, i) => {
                const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <div
                        key={skill.label}
                        data-skill-item
                        className="absolute flex flex-col items-center gap-1"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[0.6rem] font-['DM_Mono',monospace] font-bold text-zinc-900 select-none"
                            style={{ backgroundColor: skill.color }}
                        >
                            {skill.abbr}
                        </div>
                        <span className="text-[0.5rem] font-['DM_Mono',monospace] tracking-widest uppercase text-zinc-500 whitespace-nowrap">
                            {skill.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
