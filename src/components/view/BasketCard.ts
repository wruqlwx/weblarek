import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketCard extends Card {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        onDelete?: () => void
    ) {
        super(container, events);
        
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');

        if (this._deleteButton && onDelete) {
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

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесценно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
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