import { ActionInterface, PositionInterface, SizeInterface, StatusInterface } from "../../interfaces.js";
import { CollisionBlock } from "../utils/CollisionBlock.js";
import { KeyBoard } from "../utils/Keyboard.js";
import { Sprite, SpriteInterface } from "../utils/Sprite.js";
import { Inventory } from "./Inventory.js";

interface PlayerInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    collisions: CollisionBlock[],
    src: string,
    position: PositionInterface,
};

interface HitBoxInterface {
    position: PositionInterface,
    size: SizeInterface
};

interface KeyInterface {
    pressed: boolean
};

interface KeysInterface {
    [key: string]: KeyInterface
};

export class Player extends Sprite {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    collisions: CollisionBlock[];
    keyBoard: KeyBoard;
    hitBox: HitBoxInterface;
    velocity: PositionInterface;
    keys: KeysInterface;
    gravity: number;
    status: StatusInterface;
    inventory: Inventory;

    constructor({ 
        canvas, ctx, collisions, position, src, frameRate, animations, frameBuffer, loop, autoplay 
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
        this.collisions = collisions;
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
            health: 100,
            attack: 10,
            defense: 5,
            jump: {
                currents: 0,
                limit: 2,
            },
            dash: {
                isDashing: false,
                duration: 0,
                limitDuration: 16,
                speed: 15,
                cooldown: 28,
                currentDashCooldown: 0
            },
            lastDirection: "right"
        }

        this.inventory = new Inventory();

        this.keys = {
            KeyMoveRight: {
                pressed: false
            },
            KeyMoveLeft: {
                pressed: false
            },
            KeyJump: {
                pressed: false
            },
            KeyAttack: {
                pressed: false
            },
            KeyDash: {
                pressed: false
            }
        }

        this.gravity = 1;
    };

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
            {
                code: "Space",
                keydown: () => {
                    if(this.status.dash.currentDashCooldown < 12) {
                        this.keys.KeyDash.pressed = true;
                    }
                }
            }
        ];
    };

    private switchSprite(name: string): void {
        if(this.animations) {
            if(this.image === this.animations[name].image) return;
            this.currentFrame = 0;
            if (this.animations[name] && this.animations[name].image !== undefined) {
                this.image = this.animations[name].image || this.image;
            }
            this.frameRate = this.animations[name].frameRate;
            this.frameBuffer = this.animations[name].frameBuffer;
            this.loop = this.animations[name].loop;
            this.currentAnimation = this.animations[name];
        }
    };

    private movements(): void {
        this.velocity.x = 0;

        if (this.status.dash.isDashing) {
            if(this.status.lastDirection === "right") {
                this.velocity.y = 0;
                this.velocity.x = this.status.dash.speed;
                this.switchSprite('dashRight');
            } else if(this.status.lastDirection === "left") {
                this.velocity.y = 0;
                this.velocity.x = -this.status.dash.speed;
                this.switchSprite('dashLeft');
            }
            this.status.dash.duration--;
    
            if (this.status.dash.duration <= 0) {
                this.status.dash.isDashing = false;
                this.status.dash.currentDashCooldown = this.status.dash.cooldown;
            }
        } else {
            
            if(this.keys.KeyMoveRight.pressed) {
                this.velocity.x = 10;
                this.switchSprite('idleRight');
                this.status.lastDirection = "right";
            } else if(this.keys.KeyMoveLeft.pressed) {
                this.velocity.x = -10;
                this.switchSprite('idleLeft');
                this.status.lastDirection = "left";
            } else {
                if(this.status.lastDirection == "right") this.switchSprite('idleRight');
                else if(this.status.lastDirection == "left") this.switchSprite('idleLeft');
            }
    
            if(this.keys.KeyJump.pressed) {
                if(this.status.jump.currents !== 0) {
                    this.velocity.y = -15;
                    this.status.jump.currents--;
                    if(this.status.lastDirection == "right") this.switchSprite('jumpRight');
                    else if(this.status.lastDirection == "left") this.switchSprite('jumpLeft');
                };
                
                this.keys.KeyJump.pressed = false;
            };
    
            if (this.keys.KeyDash.pressed && this.status.dash.currentDashCooldown === 0) {
                this.status.dash.isDashing = true;
                this.status.dash.duration = this.status.dash.limitDuration;
                this.keys.KeyDash.pressed = false;
            }
        }

        if (this.status.dash.currentDashCooldown > 0) {
            this.status.dash.currentDashCooldown--;
        }
    };

    private drawHitBox(): void {
        // this.ctx.fillStyle = "rgba(0,255,150, 0.2)";

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
                y: this.position.y
            },
            size: {
                width: 56, // 64 - 1 * pixelSize(8)
                height: 64
            }
        }
    };

    public setup(): void {
        this.keyBoard.update();
    };

    private isCollidingHorizontal(nextX: number, collisionBlock: CollisionBlock): boolean {
        const playerLeft = nextX;
        const playerRight = nextX + this.hitBox.size.width;
        const playerTop = this.hitBox.position.y;
        const playerBottom = this.hitBox.position.y + this.hitBox.size.height;
    
        const blockLeft = collisionBlock.position.x;
        const blockRight = collisionBlock.position.x + collisionBlock.size.width;
        const blockTop = collisionBlock.position.y;
        const blockBottom = collisionBlock.position.y + collisionBlock.size.height;
    
        return (
            playerRight > blockLeft &&
            playerLeft < blockRight &&
            playerBottom > blockTop &&
            playerTop < blockBottom
        );
    }
    
    private isCollidingVertical(nextY: number, collisionBlock: CollisionBlock): boolean {
        const playerLeft = this.hitBox.position.x;
        const playerRight = this.hitBox.position.x + this.hitBox.size.width;
        const playerTop = nextY;
        const playerBottom = nextY + this.hitBox.size.height;
    
        const blockLeft = collisionBlock.position.x;
        const blockRight = collisionBlock.position.x + collisionBlock.size.width;
        const blockTop = collisionBlock.position.y;
        const blockBottom = collisionBlock.position.y + collisionBlock.size.height;
    
        return (
            playerRight > blockLeft &&
            playerLeft < blockRight &&
            playerBottom > blockTop &&
            playerTop < blockBottom
        );
    }
    
    private checkForVerticalCollisions(): void {
        const nextY = this.position.y + this.velocity.y;
    
        for (const collisionBlock of this.collisions) {
            if (this.isCollidingVertical(nextY, collisionBlock)) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.position.y = collisionBlock.position.y - this.hitBox.size.height;
                    this.status.jump.currents = this.status.jump.limit;
                } else if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y = collisionBlock.position.y + collisionBlock.size.height;
                }
            }
        }
    }
    
    private checkForHorizontalCollisions(): void {
        const nextX = this.position.x + this.velocity.x;
    
        for (const collisionBlock of this.collisions) {
            if (this.isCollidingHorizontal(nextX, collisionBlock)) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    this.position.x = collisionBlock.position.x - this.hitBox.size.width;
                } else if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    this.position.x = collisionBlock.position.x + collisionBlock.size.width;
                }
            }
        }
    }

    private applyGravity(): void {
        this.position.y += this.velocity.y;
        this.velocity.y += this.gravity;
    }

    public update(): void {
        this.position.x += this.velocity.x;

        this.checkForHorizontalCollisions();
        this.applyGravity();

        this.updateHitbox();

        this.drawHitBox();

        this.checkForVerticalCollisions();

        super.update();
        
        this.movements();

        this.status = this.inventory.applyInventoryEffects(this.status);

        console.log(this.status.attack);
    }
}