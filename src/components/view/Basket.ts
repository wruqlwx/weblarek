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
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLElement;
        
        console.log('Basket container (template):', container);
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
            console.log('Cloned basket element:', element);
        } else {
            element = container;
        }
        
        super(element);
        this._container = element;
        
        this._list = this._container.querySelector('.basket__list');
        this._total = this._container.querySelector('.basket__price');
        this._button = this._container.querySelector('.basket__button');

        console.log('Basket constructor:', {
            container: this._container,
            list: this._list,
            total: this._total,
            button: this._button
        });

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
        return this._container;
    }
}