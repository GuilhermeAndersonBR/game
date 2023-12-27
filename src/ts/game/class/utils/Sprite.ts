import { AnimationsInterface, PositionInterface, SizeInterface } from "../../interfaces.js";

export interface SpriteInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    position: PositionInterface,
    src: string,
    frameRate?: number,
    animations?: AnimationsInterface,
    frameBuffer?: number,
    loop?: boolean,
    autoplay?: boolean
}

interface CropBoxInterface {
    position: PositionInterface,
    size: SizeInterface
};

export class Sprite {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    position: PositionInterface;
    size!: SizeInterface;
    loaded: boolean;
    image: HTMLImageElement;
    frameRate: number;
    animations?: AnimationsInterface;
    frameBuffer: number;
    currentFrame: number;
    elapsedFrames: number;
    loop: boolean;
    autoplay: boolean;
    currentAnimation: any;

    constructor({ canvas, ctx, position, src, frameRate, animations, frameBuffer, loop, autoplay }: SpriteInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.position = position;
        this.loaded = false;
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => {
            this.loaded = true;
            this.size = {
                width: this.image.width / this.frameRate,
                height: this.image.height
            };
        };
        this.frameRate = frameRate ? frameRate : 1;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.animations = animations;
        this.frameBuffer = frameBuffer ? frameBuffer : 3;
        this.loop = loop ? loop : true;
        this.autoplay = autoplay ? autoplay : true;
        this.currentAnimation;

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].src;
                this.animations[key].image = image;
            }
        }
    };

    public draw(): void {
        if (!this.loaded) return;

        const cropBox: CropBoxInterface = {
            position: {
                x: this.size.width * this.currentFrame,
                y: 0
            },
            size: {
                width: this.size.width,
                height: this.size.height
            }
        };

        this.ctx.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.size.width,
            cropBox.size.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );

        this.updateFrames();
    };

    private updateFrames(): void {
        if (!this.autoplay) return;

        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++;
            } else if (this.loop) {
                this.currentFrame = 0;
            }
        }

        if (this.currentAnimation?.onComplete) {
            if (
                this.currentFrame === this.frameRate - 1 &&
                !this.currentAnimation.isActive
            ) {
                this.currentAnimation.onComplete();
                this.currentAnimation.isActive = true;
            }
        }
    };

    public update(): void {
        this.draw();
    }
}