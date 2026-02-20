import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessView {
    total: number;
}

export class Success extends Component<ISuccessView> {
    protected _message: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLElement;
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = Component.cloneTemplate<HTMLElement>(template);
        } else {
            element = container;
        }
        
        super(element);
        
        this._message = this.container.querySelector('.order-success__description');
        this._button = this.container.querySelector('.order-success__close');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        if (this._message) {
            this._message.textContent = `Списано ${value} синапсов`;
        }
    }

    render(data: Partial<ISuccessView>): HTMLElement {
        super.render(data);
        return this.container;
    }
}