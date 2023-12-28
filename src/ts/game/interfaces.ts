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

export interface StatusInterface {
    health: number,
    attack: number,
    defense: number,
    jump: {
        currents: number,
        limit: number
    },
    dash: {
        isDashing: boolean,
        duration: number,
        limitDuration: number,
        speed: number,
        cooldown: number,
        currentDashCooldown: number
    },
    lastDirection: "right" | "left"
};