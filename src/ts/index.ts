import { Canvas } from "./game/canvas.js";

const canvas = new Canvas({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    ctx: (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D,
    size: {
        width: 64 * 24,
        height: 64 * 12
    }
});

(document.getElementById("canvas") as HTMLCanvasElement).style.cursor = 'url("./assets/img/cursor.png"), auto';

canvas.setup();