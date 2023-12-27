import { ActionInterface, PositionInterface, SizeInterface } from "../../interfaces.js";
import { KeyBoard } from "../utils/Keyboard.js";
import { Sprite, SpriteInterface } from "../utils/Sprite.js";

interface PlayerInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    src: string,
    position: PositionInterface,
};

interface HitBoxInterface {
    position: PositionInterface,
    size: SizeInterface
};

interface KeyInterface {
    pressed: boolean
}

interface KeysInterface {
    [key: string]: KeyInterface
}

export class Player extends Sprite {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    keyBoard: KeyBoard;
    hitBox: HitBoxInterface;
    velocity: PositionInterface;
    keys: KeysInterface;
    gravity: number;
    status: any;

    constructor({ 
        canvas, ctx, position, src, frameRate, animations, frameBuffer, loop, autoplay 
    }: SpriteInterface & PlayerInterface) {
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
        this.keyBoard = new KeyBoard({
            actions: this.actions()
        });

        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            size: {
                width: 56, // 64 - 1 * pixelSize(8)
                height: 64
            }
        };
        
        this.velocity = {
            x: 0,
            y: 0
        };

        this.status = {
            jump: {
                currents: 2,
                limit: 2,
            }
        }

        this.keys = {
            KeyMoveRight: {
                pressed: false
            },
            KeyMoveLeft: {
                pressed: false
            },
            KeyJump: {
                pressed: false
            }
        }

        this.gravity = 1;
    }

    private movements(): void {
        this.velocity.x = 0;

        if(this.keys.KeyMoveRight.pressed) {
            this.velocity.x = 10;
        } else if(this.keys.KeyMoveLeft.pressed) {
            this.velocity.x = -10;
        };

        if(this.keys.KeyJump.pressed) {
            if(this.status.jump.currents !== 0) {
                this.velocity.y = -15;
                this.status.jump.currents--;
            };
            
            this.keys.KeyJump.pressed = false;
        };
    }

    private actions(): ActionInterface[] {
        return [
            {
                code: "KeyD",
                keydown: () => {
                    this.keys.KeyMoveRight.pressed = true;
                },
                keyup: () => {
                    this.keys.KeyMoveRight.pressed = false;
                }
            },
            {
                code: "KeyA",
                keydown: () => {
                    this.keys.KeyMoveLeft.pressed = true;
                },
                keyup: () => {
                    this.keys.KeyMoveLeft.pressed = false;
                }
            },
            {
                code: "KeyW",
                keydown: () => {
                    this.keys.KeyJump.pressed = true;
                },
            },
        ];
    };

    private drawPlayer(): void {
        // this.ctx.fillStyle = "rgba(255,0,0, 0.2)";

        // this.ctx.fillRect(
        //     this.hitBox.position.x, 
        //     this.hitBox.position.y, 
        //     this.hitBox.size.width, 
        //     this.hitBox.size.height
        // );
    };

    private updateHitbox(): void {
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y + 8
            },
            size: {
                width: 56, // 64 - 1 * pixelSize(8)
                height: 56 // 64 - 1 * pixelSize(8)
            }
        }
    };

    public setup(): void {
        console.log("setup feito com sucesso");
        
        this.keyBoard.update();
    };

    public update(): void {
        this.position.y += this.velocity.y;
        this.velocity.y += this.gravity;

        this.position.x += this.velocity.x;

        if(this.position.y + this.hitBox.size.height > this.canvas.height) {
            this.velocity.y = 0;
            this.position.y = this.canvas.height - this.hitBox.size.height;
            this.status.jump.currents = this.status.jump.limit;
        }

        //console.log(this.keyBoard.key.pressed);

        this.updateHitbox();
        this.drawPlayer();
        super.update();
        
        this.movements();
    }
}