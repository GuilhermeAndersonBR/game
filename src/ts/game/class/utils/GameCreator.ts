import { createObjectsFrom2D, findObject, parse2D } from "../../auxfunctions.js";
import { collisionOfLevel } from "../../data/collisions.js";
import { AnimationsInterface, PositionInterface, SizeInterface } from "../../interfaces.js";
import { Item } from "../elements/Item.js";
import { Player } from "../elements/Player.js";
import { InterfaceElement } from "../interface/InterfaceElement.js";
import { CollisionBlock } from "./CollisionBlock.js";
import { Mouse } from "./Mouse.js";
import { Sprite } from "./Sprite.js";

interface GameCreatorInterface {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    mouse: Mouse,
};

interface LayerInterface {
    name: string,
    elements: any[],
    setups: any[]
};

export class GameCreator {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly mouse: Mouse;
    layers: LayerInterface[];
    affectedsWithCamera: any[];
    collisionBlocks: CollisionBlock[];

    constructor({ canvas, ctx, mouse }: GameCreatorInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.mouse = mouse;
        this.layers = [
            {
                name: "UI",
                elements: [],
                setups: []
            }
        ];
        this.affectedsWithCamera = [];
        this.collisionBlocks = [];
    };

    public createItem(
        { position, src, frameRate, animations, frameBuffer, loop, autoplay }: {
            position: PositionInterface,
            src?: string,
            frameRate?: number,
            animations?: AnimationsInterface,
            frameBuffer?: number,
            loop?: boolean,
            autoplay?: boolean
        }
    ): void {
        const { canvas, ctx, layers } = this;
        const element = new Item({
            canvas: canvas,
            ctx: ctx,
            position: position,
            name: "Espada_Teste",
            description: "___01___",
            status: {
                attack: 1
            },
            effect: () => {console.log("a")},
            src: "./assets/img/scc.png",
            frameRate: frameRate,
            animations: animations,
            frameBuffer: frameBuffer,
            loop: loop,
            autoplay: autoplay
        });

        this.affectedsWithCamera.push(element);
    };

    public createSprite(
        { position, src, frameRate, animations, frameBuffer, loop, autoplay }: {
            position: PositionInterface,
            src: string,
            frameRate?: number,
            animations?: AnimationsInterface,
            frameBuffer?: number,
            loop?: boolean,
            autoplay?: boolean
        }
    ): void {
        const { canvas, ctx, layers } = this;
        const sprite = new Sprite({
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

        findObject({list: layers, key: "name", keyValue: "UI"}).elements.push(sprite);
    };

    public createCollisions(): void {
        const parsedCollisions = parse2D({
            array: collisionOfLevel
        });

        this.collisionBlocks = createObjectsFrom2D({
            ctx: this.ctx,
            array: parsedCollisions
        });
    };

    private updateLayer(name: string): void {
        const layer = findObject({list: this.layers, key: "name", keyValue: name}).elements;
        layer.forEach((element: { update: () => void; }) => {
            element.update();
        });
    };

    public update(): void {
        this.updateLayer("UI");
    };

    public setup(): void {

        this.layers.forEach(layer => {
            layer.setups.forEach((element: { setup: () => void; }) => {
                element.setup();
            });
        });
    };
};