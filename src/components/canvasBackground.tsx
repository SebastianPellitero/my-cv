"use client";
import { fractalShell, fractalTree } from "@/app/drawings/fractals";
import { useEffect } from "react";

const CanvasBackground = () => {
    useEffect(() => {
        var myCanvas = document.getElementById("my_canvas") as HTMLCanvasElement;
        if (!myCanvas) return;
        var ctx = myCanvas.getContext("2d");
        if (!ctx) return;
        fractalShell(myCanvas, ctx);
        // fractalTree(400, 600, 120, 0, 10, ctx)
    });

    return <canvas id="my_canvas" width="1600" height="800"></canvas>
}

export default CanvasBackground;