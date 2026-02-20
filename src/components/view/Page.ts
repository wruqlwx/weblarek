import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<object> {
    protected _catalog: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement | null;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._catalog = container.querySelector('.gallery') as HTMLElement;
        this._basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement | null;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;

        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => {
                this.events.emit('page:basket-open');
            });
        }
    }

    set catalog(items: HTMLElement[]) {
        if (this._catalog) {
            this._catalog.replaceChildren(...items);
        }
    }

    set counter(value: number) {
        if (this._basketCounter) {
            this._basketCounter.textContent = value.toString();
        }
    }

    set locked(value: boolean) {
        if (this._wrapper) {
            if (value) {
                this._wrapper.classList.add('page__wrapper_locked');
            } else {
                this._wrapper.classList.remove('page__wrapper_locked');
            }
        }
    }
}