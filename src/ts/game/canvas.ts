import { clearWindow, findObject, preventDefaults } from "./auxfunctions.js";
import { GameCreator } from "./class/utils/GameCreator.js";
import { KeyBoard } from "./class/utils/Keyboard.js";
import { Mouse } from "./class/utils/Mouse.js";

interface SizeInterface {
    width: number,
    height: number
};

interface CanvasInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    size: SizeInterface,
};

export class Canvas {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly size: SizeInterface;
    readonly mouse: Mouse;
    gameCreator: GameCreator;

    constructor({ canvas, ctx, size }: CanvasInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = size;
        this.mouse = new Mouse({canvas: this.canvas});
        this.gameCreator = new GameCreator({
            canvas: this.canvas,
            ctx: this.ctx,
            mouse: this.mouse,
        });
    };

    private draw(): void {
        this.gameCreator.createPlayer({
            src: "./assets/img/idleRight.png",
            position: {
                x: 50,
                y: 50
            },
            frameBuffer: 12,
            frameRate: 2,
            animations: {
                idleRight: {
                    frameRate: 11,
                    frameBuffer: 2,
                    loop: true,
                    src: "./assets/img/idleRight.png",
                },
            }
        })

        this.gameCreator.createSprite({
            position: {
                x: 30,
                y: 30
            },
            frameRate: 9,
            src: "./assets/img/animation.png"
        });
    };

    private update = (): void => {
        requestAnimationFrame(this.update);
        clearWindow({canvas: this.canvas, ctx: this.ctx});

        this.gameCreator.update();
    };

    private defineInputs(): void {
        this.mouse.update();
    };

    public setup(): void {
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.imageSmoothingQuality = 'high';

        preventDefaults();
        

        this.defineInputs();
        this.draw();
        this.gameCreator.setup();
        this.update();
    };
};