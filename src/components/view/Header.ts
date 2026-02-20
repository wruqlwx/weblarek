import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<object> {
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;

        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => {
                this.events.emit('header:basket-open');
            });
        }
    }

    set counter(value: number) {
        if (this._basketCounter) {
            this._basketCounter.textContent = value.toString();
        }
    }
}