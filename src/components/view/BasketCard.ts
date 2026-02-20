import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketCard extends Card {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        console.log('BasketCard container:', container);
        console.log('BasketCard innerHTML:', container.innerHTML);
        
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');

        console.log('BasketCard constructor:', {
            container: container,
            index: this._index,
            deleteButton: this._deleteButton
        });

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', (evt) => {
                evt.stopPropagation();
                console.log('BasketCard delete clicked for id:', this.container.dataset.id);
                this.events.emit('basket:remove', { id: this.container.dataset.id });
            });
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = value.toString();
            console.log('BasketCard index set to:', value);
        }
    }

    render(data: IProduct, index?: number): HTMLElement {
        super.render(data);
        if (index !== undefined) {
            this.index = index;
        }
        console.log('BasketCard rendered for product:', data.title);
        return this.container;
    }
}