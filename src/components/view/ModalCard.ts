import { BaseProductCard } from './BaseProductCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class ModalCard extends BaseProductCard {
    protected _description: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        onAction: () => void
    ) {
        super(container, events);
        
        this._description = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');

        if (this._button) {
            this._button.addEventListener('click', (evt) => {
                evt.stopPropagation();
                onAction();
            });
        }
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    setButtonState(isInBasket: boolean) {
        if (this._button && !this._button.disabled) {
            this._button.textContent = isInBasket ? 'Удалить из корзины' : 'Купить';
        }
    }

    updateButtonState(isInBasket: boolean) {
        this.setButtonState(isInBasket);
    }

    set price(value: number | null) {
        super.price = value;
        if (this._button && value === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        }
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        this.description = data.description;
        return this.container;
    }
}