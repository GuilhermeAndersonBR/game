import { Sprite, SpriteInterface } from "../utils/Sprite.js";

interface ItemInterface {
    name: string,
    src: string,
    description: string,
    status: any;
    effect: () => void
}

export class Item extends Sprite {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    name: string;
    description: string;
    status: any;
    effect: () => void;

    constructor({ 
        canvas, 
        ctx, 
        name, 
        description, 
        status, 
        effect, 
        position,
        src, 
        frameRate, 
        animations, 
        frameBuffer, 
        loop, 
        autoplay 
    }: SpriteInterface & ItemInterface) {
        super({
            canvas: canvas, 
            ctx: ctx, 
            position: position, 
            src: src, 
            frameRate: frameRate,
            animations: animations,
            frameBuffer: frameBuffer,
            loop: loop,
            autoplay: autoplay
        });
        this.canvas = canvas;
        this.ctx = ctx;
        this.name = name;
        this.description = description;
        this.status = status;
        this.effect = effect;
    };

    public update(): void {
        super.update();
    }
}