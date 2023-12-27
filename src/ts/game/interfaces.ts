export interface SizeInterface {
    width: number,
    height: number
};

export interface PositionInterface {
    x: number,
    y: number
};

interface AnimationInterface {
    image?: HTMLImageElement;
    frameRate: number;
    frameBuffer: number;
    loop: boolean;
    src: string;
}

export interface AnimationsInterface {
    [key: string]: AnimationInterface
};

export interface ActionInterface {
    code: string,
    keydown?: () => void;
    keyup?: () => void;
};