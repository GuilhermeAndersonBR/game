import { PositionInterface, SizeInterface } from "../../interfaces.js";

interface CollisionBlockInterface {
    ctx: CanvasRenderingContext2D,
    position: PositionInterface
}

export class CollisionBlock {
    readonly ctx: CanvasRenderingContext2D;
    position: PositionInterface;
    size: SizeInterface;

    constructor({ ctx, position }: CollisionBlockInterface) {
        this.ctx = ctx;
        this.position = position;

        this.size = {
            width: 64,
            height: 64
        };
    };

    private draw(): void {
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    };

    public update(): void {
        this.draw();
    };
}