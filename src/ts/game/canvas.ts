import { clearWindow, findObject, preventDefaults } from "./auxfunctions.js";
import { Item } from "./class/elements/Item.js";
import { Player } from "./class/elements/Player.js";
import { Camera } from "./class/utils/Camera.js";
import { GameCreator } from "./class/utils/GameCreator.js";
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
    player?: Player;
    camera?: Camera;

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
        this.player;
        this.camera;
    };

    private draw(): void {

        const sword = new Item({
            canvas: this.canvas,
            ctx: this.ctx,
            name: "Espada",
            description: "teste",
            effect: () => {console.log("a")},
            position: {
                x: 30,
                y: 504
            },
            src: "./assets/img/scc.png",
            status: {
                attack: 1
            }
        });

        this.player = new Player({
            canvas: this.canvas,
            ctx: this.ctx,
            collisions: this.gameCreator.collisionBlocks,
            src: "./assets/img/idleRight.png",
            position: {
                x: 50,
                y: 184
            },
            frameBuffer: 12,
            frameRate: 2,
            animations: {
                idleRight: {
                    frameRate: 2,
                    frameBuffer: 18,
                    loop: true,
                    src: "./assets/img/idleRight.png",
                },
                idleLeft: {
                    frameRate: 2,
                    frameBuffer: 18,
                    loop: true,
                    src: "./assets/img/idleLeft.png",
                },
                jumpRight: {
                    frameRate: 2,
                    frameBuffer: 12,
                    loop: false,
                    src: "./assets/img/jumpRight.png",
                },
                jumpLeft: {
                    frameRate: 2,
                    frameBuffer: 12,
                    loop: false,
                    src: "./assets/img/jumpLeft.png",
                },
                dashRight: {
                    frameRate: 1,
                    frameBuffer: 12,
                    loop: false,
                    src: "./assets/img/dashRight.png",
                },
                dashLeft: {
                    frameRate: 1,
                    frameBuffer: 12,
                    loop: false,
                    src: "./assets/img/dashLeft.png",
                }
            }
        });

        this.player.inventory.addToInventory(sword);
    };

    private drawBackground(): void {
        const image = new Image();
        image.src = "./assets/img/map.png";
        this.ctx.drawImage(
            image,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    };

    private update = (): void => {
        requestAnimationFrame(this.update);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera?.applyCameraTransform();

        this.drawBackground();

        this.camera?.update();

        this.camera?.reset();

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
        this.gameCreator.createCollisions();
        this.draw();
        this.player?.setup();
        this.gameCreator.setup();

        if(this.player) {
            const cameraObjects = [
                this.player
            ];

            this.gameCreator.affectedsWithCamera.forEach(element => {
                cameraObjects.push(element);
            });
    
            this.camera = new Camera({
                canvas: this.canvas,
                ctx: this.ctx,
                player: this.player,
                objectsToTrack: cameraObjects,
            });
        }
        
        this.update();
    };
};