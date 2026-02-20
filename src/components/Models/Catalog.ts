import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CatalogModel {
    protected _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('catalog:changed', { items: this._items });
    }

    get items(): IProduct[] {
        return this._items;
    }

    getProduct(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    updateProduct(id: string, updates: Partial<IProduct>): void {
        const index = this._items.findIndex(item => item.id === id);
        if (index !== -1) {
            this._items[index] = { ...this._items[index], ...updates };
            this.events.emit('catalog:changed', { items: this._items });
            this.events.emit('catalog:product-changed', { id, product: this._items[index] });
        }
    }
}