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
}