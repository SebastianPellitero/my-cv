"use client";
export function fractalTree(startX: number, startY: number, len: number, angle: number, branchWidth: number, ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = branchWidth;

    ctx.beginPath();
    ctx.save();

    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";

    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.8)";

    if (len < 10) {
        ctx.restore();
        return;
    }

    fractalTree(0, -len, len * 0.7, angle - 25, branchWidth * 0.7, ctx);
    fractalTree(0, -len, len * 0.8, angle + 2, branchWidth * 0.8, ctx);

    ctx.restore();
}

export function fractalShell(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'violet';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';

    let size = 200;
    let sides = 20;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, 1);
    ctx.rotate(0);

    for (let i = 0; i < sides; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        ctx.rotate((Math.PI * 2) / sides);
        ctx.scale(0.99, 0.95);
    }
    ctx.restore();
}   