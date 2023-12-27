interface PositionInterface {
    x: number,
    y: number
};

interface MouseInterface {
    canvas: HTMLCanvasElement
}

export class Mouse {
    position: PositionInterface;
    click: boolean;
    readonly canvas: HTMLCanvasElement;

    constructor({ canvas }: MouseInterface) {
        this.canvas = canvas;
        this.position = {
            x: 0,
            y: 0
        }

        this.click = false;
    };

    private newPosition(): void {
        window.addEventListener("mousemove", (event: {clientX: number, clientY: number}) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            this.position = {x: mouseX, y: mouseY};
        })
    };

    private newClick(): void {
        window.addEventListener("mousedown", () => {
            this.click = true;
        });

        window.addEventListener("mouseup", () => {
            this.click = false;
        })
    }

    public update(): void {
        this.newClick();
        this.newPosition();
    }
}