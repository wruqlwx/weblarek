import { BaseProductCard } from './BaseProductCard';
import { IEvents } from '../base/Events';

export class CatalogCard extends BaseProductCard {
    protected _button: HTMLButtonElement | null;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        onSelect: () => void,
        onAction: () => void
    ) {
        super(container, events);
        
        this._button = container.querySelector('.card__button');

        container.addEventListener('click', (evt) => {
            evt.preventDefault();
            onSelect();
        });

        if (this._button) {
            this._button.addEventListener('click', (evt) => {
                evt.stopPropagation();
                onAction();
            });
        }
    }

    setButtonState(isInBasket: boolean) {
        if (this._button && !this._button.disabled) {
            this._button.textContent = isInBasket ? 'Удалить из корзины' : 'Купить';
        }
    }

    set price(value: number | null) {
        super.price = value;
        if (this._button && value === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        }
    }
}