import { StatusInterface } from "../../interfaces.js";
import { Item } from "./Item.js";

export class Inventory {
    items: Item[];

    constructor() {
        this.items = [];
    };

    public addToInventory(item: Item): void {
        this.items.push(item);
    };

    public removeFromInventory(itemName: string): void {
        this.items = this.items.filter(item => item.name !== itemName);
    };

    private calculateAttack(status: StatusInterface): number {
        let attack = status.attack;

        for (const item of this.items) {
            if (item.status.attack) {
                attack += item.status.attack;
            }
        }

        return attack;
    };

    public applyInventoryEffects(status: StatusInterface): StatusInterface {
        return {
            ...status,
            attack: this.calculateAttack(status),
            // Adicione outros cálculos aqui para outras propriedades do status
        };
    };
}