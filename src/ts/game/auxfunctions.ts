import { CollisionBlock } from "./class/utils/CollisionBlock.js";

interface FindObjectInterface {
    (objects: {list: any[], key: string, keyValue: string}): any;
};

export const findObject: FindObjectInterface = ({ list, key, keyValue }) => {
    return list.find(objeto => objeto[key] === keyValue);
};

interface ClearWindowInterface {
    (objects: {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}): void;
}

export const clearWindow: ClearWindowInterface = ({ canvas, ctx }) => {
    const image = new Image();
    image.src = "./assets/img/map.png";
    image.onload = () => {
        ctx.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
};

export const preventDefaults = (): void => {
    document.addEventListener('contextmenu', (event): void => {
        event.preventDefault();
    });
};

export const parse2D = ({ array }: {array: any[]}): any[] => {
    const rows = [];
    for (let i = 0; i < array.length; i += 24) {
        rows.push(array.slice(i, i + 24));
    };
  
    return rows;
};

export const createObjectsFrom2D = ({ ctx, array }: {ctx: CanvasRenderingContext2D, array: any[]}): CollisionBlock[] => {
    const objects: CollisionBlock[] = [];
    array.forEach((row, y) => {
        row.forEach((symbol: number, x: number) => {
            if (symbol === 1025 || symbol === 250) {
                // push a new collision into collisionblocks array
                objects.push(
                    new CollisionBlock({
                        ctx: ctx,
                        position: {
                            x: x * 64,
                            y: y * 64
                        }
                    })
                );
            }
        });
    });
  
    return objects;
};