import { PositionInterface, SizeInterface } from "../../interfaces.js";

interface InterfaceElementInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    size: SizeInterface,
    position: PositionInterface
};

export class InterfaceElement {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    size: SizeInterface;
    position: PositionInterface;

    constructor({ canvas, ctx, size, position }: InterfaceElementInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = size;
        this.position = position;
    };

    private draw(): void {
        const { ctx, position, size } = this;
        ctx.fillStyle = "red";
        ctx.fillRect(position.x, position.y, size.width, size.height);
    };

    public update(): void {
        this.draw();
    };
};