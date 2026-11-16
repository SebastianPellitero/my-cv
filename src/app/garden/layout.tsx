import { Cabin_Sketch, Patrick_Hand } from "next/font/google";
import "./garden.css";

// Garden only: sketched capitals for titles, a neat pencil hand for everything else
const sketch = Cabin_Sketch({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-sketch" });
const hand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-hand" });

export default function GardenLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`garden ${sketch.variable} ${hand.variable}`}>
            {/* #pencil: bends a straight line slightly, then knocks specks out of it like graphite on paper.
                Used from garden.css on borders and rules, never on text. */}
            <svg aria-hidden width="0" height="0" className="absolute">
                <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" result="wobbly" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="7" result="grain" />
                    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.45" result="specks" />
                    <feComposite in="wobbly" in2="specks" operator="in" />
                </filter>
            </svg>
            {children}
        </div>
    );
}
