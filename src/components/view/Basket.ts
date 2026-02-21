import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement | null;
    protected _total: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:order');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (this._list) {
            if (items.length > 0) {
                this._list.replaceChildren(...items);
            } else {
                this._list.innerHTML = '<li class="basket__item">Корзина пуста</li>';
            }
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data: IBasketView): HTMLElement {
        super.render(data);
        return this.container;
    }
}