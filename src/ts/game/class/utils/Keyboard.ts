import { findObject } from "../../auxfunctions";
import { ActionInterface } from "../../interfaces";

interface KeyBoardInterface {
    actions: any
};

interface KeyEventInterface {
    code: string,
    shiftKey: boolean
};

export class KeyBoard {
    private actions: ActionInterface[];

    constructor({ actions }: KeyBoardInterface) {
        this.actions = actions;
    };

    private newPressed(): void {
        window.addEventListener("keydown", (event : KeyEventInterface): void => {
            console.log(event.code);
            this.actions.forEach((action: ActionInterface) => {
                if(event.code === action.code && action.keydown) {
                    action.keydown();
                }
            });
        });

        window.addEventListener("keyup", (event : KeyEventInterface): void => {
            this.actions.forEach((action: ActionInterface) => {
                if(event.code === action.code && action.keyup) {
                    action.keyup();
                }
            });
        });
    };

    public update(): void {
        this.newPressed();
    }
};