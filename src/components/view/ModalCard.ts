import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class ModalCard extends Card {
    protected _description: HTMLElement | null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
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
        return this.container;
    }
}