"use client";
import { useEffect, useRef } from "react";

type Props = {
    animate?: boolean;        // enable subtle motion
    speed?: number;           // base animation speed (try 0.015 .. 0.04)
    zIndex?: number;          // default -1
};

type Trail = {
    r: number;        // radius
    a0: number;       // base start angle
    len: number;      // arc length (radians)
    color: string;
    width: number;
    alpha: number;
    blur: number;
};

const CanvasVectorBackground: React.FC<Props> = ({
    animate = true,
    speed = 0.02,          // slower by default
    zIndex = -1,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // ---------- palette ----------
        const COL = {
            sky1: "#0b0e1c",
            sky2: "#171c3a",
            trailA: "#bcd3ff",
            trailB: "#85a7ff",
            trailC: "#e2f1ff",
            snow: "#e9f3ff",
            far: "#0a0f1a",
            mid: "#0a1019",
            near: "#0a0b12",
            ridgeStroke: "rgba(220,235,255,0.06)",
            lakeTop: "#05070d",
            lakeBot: "#0b0e18",
            aurora1: "rgba(120,255,160,0.18)",
            aurora2: "rgba(100,220,120,0.22)",
            aurora3: "rgba(160,255,190,0.16)",
        };

        // ---------- sizing ----------
        let dpr = 1;
        const resize = () => {
            dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
        };

        // ---------- utilities ----------
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

        // Deterministic PRNG (Mulberry32) so shapes don't jump each frame
        const mulberry32 = (seed: number) => {
            return () => {
                let t = (seed += 0x6D2B79F5);
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        };

        // Cosine-smooth interpolation
        const smoothstep = (t: number) => (1 - Math.cos(Math.PI * clamp(t, 0, 1))) / 2;

        // 1D value noise + fBm
        function makeNoise1D(seed: number) {
            const rand = mulberry32(seed);
            const table = new Float32Array(1024);
            for (let i = 0; i < table.length; i++) table[i] = rand() * 2 - 1;
            const n = (x: number) => {
                const xi = Math.floor(x) % table.length;
                const xf = x - Math.floor(x);
                const a = table[(xi + table.length) % table.length];
                const b = table[(xi + 1) % table.length];
                return lerp(a, b, smoothstep(xf));
            };
            const fbm = (x: number, oct = 4, lac = 2, gain = 0.5) => {
                let amp = 0.5, freq = 1, sum = 0;
                for (let i = 0; i < oct; i++) {
                    sum += amp * n(x * freq);
                    freq *= lac;
                    amp *= gain;
                }
                return sum;
            };
            return fbm;
        }

        // ---------- star trails (precompute) ----------
        let trails: Trail[] = [];
        function buildTrails(w: number, h: number) {
            const R = Math.max(w, h);
            const rand = mulberry32(1337);
            trails = [];
            const count = 520; // density
            for (let i = 0; i < count; i++) {
                const r = lerp(0.25, 1.4, Math.pow(rand(), 0.7)) * R;
                const len = lerp(0.12, 0.30, rand());    // shorter segments feel more "traily"
                const a0 = rand() * Math.PI * 2;
                const pick = rand();
                const color = pick < 0.33 ? COL.trailA : pick < 0.66 ? COL.trailB : COL.trailC;
                const width = lerp(0.5, 1.8, rand());
                const alpha = lerp(0.25, 0.9, rand());
                const blur = lerp(1, 5, rand());
                trails.push({ r, a0, len, color, width, alpha, blur });
            }
        }

        function drawTrails(w: number, h: number, time: number) {
            // Center offset to mimic the photo's swirl
            if (!ctx) return;
            const cx = -0.15 * w;
            const cy = 0.05 * h;

            ctx.save();
            ctx.lineCap = "round";
            const omega = animate ? 0.02 : 0.0; // << much slower rotation factor
            for (const t of trails) {
                ctx.strokeStyle = t.color;
                ctx.globalAlpha = t.alpha;
                ctx.lineWidth = t.width;
                ctx.shadowColor = t.color;
                ctx.shadowBlur = t.blur;

                const a0 = t.a0 + time * omega;
                ctx.beginPath();
                ctx.arc(cx, cy, t.r, a0, a0 + t.len, false);
                ctx.stroke();
            }
            ctx.restore();
        }

        // ---------- aurora ----------
        function drawAurora(w: number, h: number, time: number) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.lineCap = "round";
            const baseY = h * 0.45;
            const shift = animate ? time : 0;

            const ribbon = (offset: number, amp: number, thick: number, color: string) => {
                ctx.beginPath();
                const steps = 22;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = lerp(-w * 0.05, w * 1.05, t);
                    const y =
                        baseY +
                        Math.sin(t * Math.PI * 2 + offset + shift * 0.45) * amp +
                        Math.sin(t * 6 + offset * 0.8 + shift * 0.35) * amp * 0.25;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.strokeStyle = color;
                ctx.lineWidth = thick;
                ctx.shadowColor = color;
                ctx.shadowBlur = 20;
                ctx.stroke();
            };

            ribbon(0.0, h * 0.05, 22, COL.aurora1);
            ribbon(0.7, h * 0.045, 18, COL.aurora2);
            ribbon(1.4, h * 0.04, 14, COL.aurora3);
            ctx.restore();
        }

        // ---------- mountains (elaborate) ----------
        function drawMountainLayer(
            w: number,
            h: number,
            {
                seed,
                baseY,          // baseline (pixels)
                amplitude,      // peak variance
                detail = 4,     // noise octaves
                fill,
                snowLine = 0,   // 0..1 fraction near peaks to tint with snow
                ridge = false,  // draw ridge strokes?
            }: {
                seed: number;
                baseY: number;
                amplitude: number;
                detail?: number;
                fill: string | CanvasGradient;
                snowLine?: number;
                ridge?: boolean;
            }
        ) {
            const fbm = makeNoise1D(seed);
            const pts: { x: number; y: number }[] = [];
            const cols = Math.max(180, Math.floor(w / 7)); // resolution

            // Build the ridge line with fBm
            for (let i = 0; i <= cols; i++) {
                const t = i / cols;
                const x = t * w;
                const n = fbm(t * 5.0, detail, 2.0, 0.55); // multi-octave noise
                // shape the profile so it rises in the middle and dips near edges
                const envelope = Math.pow(1 - Math.abs(t - 0.5) * 2, 1.4);
                const y = baseY - (envelope * amplitude) * (0.5 + 0.5 * n);
                pts.push({ x, y });
            }

            // Fill polygon to bottom
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let i = 0; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();

            // Snow caps near highest areas
            if (snowLine > 0) {
                const peakY = Math.min(...pts.map(p => p.y));
                const snowThreshold = lerp(peakY, baseY, 1 - snowLine);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(0, h);
                for (let i = 0; i < pts.length; i++) {
                    const p = pts[i];
                    const yy = Math.min(p.y, snowThreshold);
                    i === 0 ? ctx.lineTo(p.x, yy) : ctx.lineTo(p.x, yy);
                }
                ctx.lineTo(w, h);
                ctx.closePath();
                ctx.globalAlpha = 0.12;
                ctx.fillStyle = COL.snow;
                ctx.fill();
                ctx.restore();
            }

            // Ridge strokes (adds detail/texture)
            if (ridge) {
                ctx.save();
                ctx.strokeStyle = COL.ridgeStroke;
                ctx.lineWidth = 1;
                for (let i = 2; i < pts.length - 2; i += 2) {
                    const p = pts[i];
                    const p2 = pts[i + 2];
                    const dx = p2.x - p.x;
                    const dy = p2.y - p.y;
                    const len = Math.hypot(dx, dy);
                    if (!len) continue;
                    // draw a short stroke slightly down the slope
                    const nx = dx / len, ny = dy / len;
                    const sx = p.x, sy = p.y;
                    const ex = sx + nx * 14 - ny * 6;
                    const ey = sy + ny * 14 + nx * 6;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                }
                ctx.restore();
            }

            ctx.restore();
        }

        function drawMountains(w: number, h: number) {
            // Far gradient
            const farFill = (() => {
                const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
                g.addColorStop(0, "#0a0f1a");
                g.addColorStop(1, "#070a11");
                return g;
            })();
            drawMountainLayer(w, h, {
                seed: 101,
                baseY: h * 0.78,
                amplitude: h * 0.18,
                detail: 4,
                fill: farFill,
                snowLine: 0.25,
                ridge: false,
            });

            // Mid
            const midFill = (() => {
                const g = ctx.createLinearGradient(0, h * 0.62, 0, h);
                g.addColorStop(0, "#0a1019");
                g.addColorStop(1, "#080a12");
                return g;
            })();
            drawMountainLayer(w, h, {
                seed: 202,
                baseY: h * 0.82,
                amplitude: h * 0.22,
                detail: 5,
                fill: midFill,
                snowLine: 0.18,
                ridge: true,
            });

            // Near (foreground, chunkier)
            const nearFill = COL.near;
            drawMountainLayer(w, h, {
                seed: 303,
                baseY: h * 0.86,
                amplitude: h * 0.28,
                detail: 5,
                fill: nearFill,
                snowLine: 0.10,
                ridge: true,
            });
        }

        // ---------- lake ----------
        function drawLake(w: number, h: number) {
            ctx.save();
            const y0 = h * 0.86;
            const g = ctx.createLinearGradient(0, y0, 0, h);
            g.addColorStop(0, COL.lakeTop);
            g.addColorStop(1, COL.lakeBot);
            ctx.fillStyle = g;
            ctx.fillRect(0, y0, w, h - y0);

            // aurora reflection glow
            ctx.globalCompositeOperation = "lighter";
            const rg = ctx.createRadialGradient(w * 0.45, h * 0.90, 0, w * 0.45, h * 0.96, w * 0.36);
            rg.addColorStop(0, "rgba(120,255,160,0.14)");
            rg.addColorStop(1, "rgba(120,255,160,0.00)");
            ctx.fillStyle = rg;
            ctx.fillRect(0, y0, w, h - y0);
            ctx.restore();
        }

        const skyGradient = (w: number, h: number) => {
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, COL.sky2);
            g.addColorStop(1, COL.sky1);
            return g;
        };

        // ---------- render loop ----------
        const render = (() => {
            let t = 0;
            return (dt: number) => {
                const w = window.innerWidth;
                const h = window.innerHeight;

                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = skyGradient(w, h);
                ctx.fillRect(0, 0, w, h);

                drawTrails(w, h, t);
                drawAurora(w, h, t);
                drawMountains(w, h);
                drawLake(w, h);

                if (animate) t += speed; // slow
            };
        })();

        let last = performance.now();
        const tick = (now: number) => {
            const dt = now - last;
            last = now;
            render(dt);
            rafRef.current = requestAnimationFrame(tick);
        };

        const onResize = () => {
            resize();
            buildTrails(window.innerWidth, window.innerHeight);
            // immediate re-render
            render(0);
        };

        resize();
        buildTrails(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", onResize, { passive: true });
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", onResize);
        };
    }, [animate, speed]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                zIndex,
                background: "#000",
            }}
        />
    );
};

export default CanvasVectorBackground;
