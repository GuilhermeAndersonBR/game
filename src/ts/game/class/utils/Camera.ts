import { Player } from "../elements/Player";

interface CameraInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    objectsToTrack: { update: () => void; }[];
};

export class Camera {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly player: Player;
    readonly objectsToTrack: { update: () => void; }[];

    constructor({ canvas, ctx, player, objectsToTrack }: CameraInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = player;
        this.objectsToTrack = objectsToTrack;
    };

    public applyCameraTransform(): void {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const playerX = this.player.position.x;
        const playerY = this.player.position.y;

        const offsetX = centerX - playerX;
        const offsetY = centerY - playerY;

        this.ctx.translate(offsetX, offsetY);
    };

    public reset(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Restaura a transformação para a identidade
    };

    public update(): void {
        this.objectsToTrack.forEach((object: { update: () => void; }) => {
            object.update();
        });
    };
};