import { ProductCard } from './ProductCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class ModalCard extends ProductCard {
    protected _description: HTMLElement | null;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        onAction?: () => void
    ) {
        super(container, events, undefined, onAction);
        this._description = container.querySelector('.card__text');
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    updateButtonState(isInBasket: boolean) {
        this.setButtonState(isInBasket);
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        this.description = data.description;
        return this.container;
    }
}