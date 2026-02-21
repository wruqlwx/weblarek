import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Card extends Component<object> {
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
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
}