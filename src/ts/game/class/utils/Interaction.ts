import { PositionInterface, SizeInterface } from "../../interfaces.js";
import { KeyBoard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";

export interface InteractionInterface {
    readonly mouse: Mouse,
    keyBoard: KeyBoard,
    position: PositionInterface,
    size: SizeInterface,
    onhover?: () => void,
    onclick?: () => void
};

export class Interaction implements InteractionInterface {
    mouse: Mouse;
    keyBoard: KeyBoard;
    position: PositionInterface;
    size: SizeInterface;
    onhover?: () => void;
    onclick?: () => void;

    constructor({ mouse, keyBoard, position, size, onhover, onclick }: InteractionInterface) {
        this.mouse = mouse;
        this.keyBoard = keyBoard;
        this.position = position;
        this.size = size;

        this.onhover = onhover;
        this.onclick = onclick;
    };

    public mouseHover(): boolean {
        return (
            this.mouse.position.x > this.position.x && 
            this.mouse.position.x < this.position.x + this.size.width &&
            this.mouse.position.y > this.position.y && 
            this.mouse.position.y < this.position.y + this.size.height
        );
    };

    public mouseClick(): boolean {
        return (
            this.mouseHover() && this.mouse.click
        );
    };
};