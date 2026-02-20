import { IEvents } from '../base/Events';
import { IBasket, IProduct } from '../../types';

export class BasketModel implements IBasket {
    protected _items: Map<string, IProduct> = new Map();
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    add(item: IProduct): void {
        this._items.set(item.id, item);
        this.events.emit('basket:changed', { items: this.getItems() });
    }

    remove(id: string): void {
        this._items.delete(id);
        this.events.emit('basket:changed', { items: this.getItems() });
    }

    clear(): void {
        this._items.clear();
        this.events.emit('basket:changed', { items: [] });
    }

    getTotalPrice(): number {
        let total = 0;
        this._items.forEach(item => {
            if (item.price !== null) {
                total += item.price;
            }
        });
        return total;
    }

    getItemsCount(): number {
        return this._items.size;
    }

    hasItem(id: string): boolean {
        return this._items.has(id);
    }

    getItems(): IProduct[] {
        return Array.from(this._items.values());
    }

    getItemsIds(): string[] {
        return Array.from(this._items.keys());
    }
}