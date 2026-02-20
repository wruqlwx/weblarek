import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement | null;
    protected _container: HTMLFormElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLFormElement;
        
        console.log('OrderForm constructor container:', container);
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
            console.log('Cloned order form element:', element);
        } else {
            element = container as HTMLFormElement;
        }
        
        super(element, events);
        this._container = element;
        
        this._paymentButtons = Array.from(this._container.querySelectorAll('.button_alt'));
        this._addressInput = this._container.querySelector('[name="address"]');

        console.log('OrderForm constructor:', {
            paymentButtons: this._paymentButtons.length,
            addressInput: this._addressInput
        });

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.name === 'card' ? 'online' : 'cash';
                this.payment = paymentType as TPayment;
                this.events.emit('order:payment-change', { payment: paymentType });
            });
        });
    }

    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            const buttonValue = button.name === 'card' ? 'online' : 'cash';
            if (buttonValue === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }
}