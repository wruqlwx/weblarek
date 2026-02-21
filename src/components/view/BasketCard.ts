import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketCard extends Card {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        onDelete: () => void
    ) {
        super(container, events);
        
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', (evt) => {
                evt.stopPropagation();
                onDelete();
            });
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = value.toString();
        }
    }

    render(data: IProduct, index?: number): HTMLElement {
        this.title = data.title;
        this.price = data.price;
        if (index !== undefined) {
            this.index = index;
        }
        return this.container;
    }
}