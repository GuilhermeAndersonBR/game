import { createObjectsFrom2D, findObject, parse2D } from "../../auxfunctions.js";
import { collisionOfLevel } from "../../data/collisions.js";
import { AnimationsInterface, PositionInterface, SizeInterface } from "../../interfaces.js";
import { Player } from "../elements/Player.js";
import { InterfaceElement } from "../interface/InterfaceElement.js";
import { CollisionBlock } from "./CollisionBlock.js";
import { KeyBoard } from "./Keyboard.js";
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
    collisionBlocks: any[];

    constructor({ canvas, ctx, mouse }: GameCreatorInterface) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.mouse = mouse;
        this.layers = [
            {
                name: "Player",
                elements: [],
                setups: []
            },
            {
                name: "UI",
                elements: [],
                setups: []
            }
        ];
        this.collisionBlocks = [];
    };

    public createPlayer(
        { position, src, frameRate, animations, frameBuffer, loop, autoplay }: {
            src: string,
            position: PositionInterface,
            frameRate?: number,
            animations?: AnimationsInterface,
            frameBuffer?: number,
            loop?: boolean,
            autoplay?: boolean
        }
    ): void {
        const { canvas, ctx, layers } = this;
        const player = new Player({
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

        const layer = findObject({list: layers, key: "name", keyValue: "Player"});
        layer.elements.push(player);
        layer.setups.push(player);
    };

    public createBox(
        { size, position }: {
            size: SizeInterface,
            position: PositionInterface
        }
    ): void {
        const { canvas, ctx, layers } = this;
        const element = new InterfaceElement({
            canvas: canvas,
            ctx: ctx,
            size: size,
            position: position
        });

        findObject({list: layers, key: "name", keyValue: "UI"}).elements.push(element);
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

    private createCollisions(): void {
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
        this.updateLayer("Player");
        this.updateLayer("UI");

        this.collisionBlocks.forEach(collisionBlock => {
            collisionBlock.update();
        });
    };

    public setup(): void {
        this.createCollisions();

        this.layers.forEach(layer => {
            layer.setups.forEach((element: { setup: () => void; }) => {
                element.setup();
            });
        });
    };
};