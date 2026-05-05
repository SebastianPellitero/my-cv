import { skills } from '@/data/intro'

export default function SkillsRing({ radius = 120 }: { radius?: number }) {
    void radius // radius is applied via GSAP in ImpressFlow
    return (
        <div data-skills-ring className="absolute inset-0">
            {skills.map((skill) => (
                <div
                    key={skill.label}
                    data-skill-item
                    className="absolute flex flex-col items-center gap-1"
                    style={{ top: '50%', left: '50%' }}
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
            ))}
        </div>
    )
}
