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

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        
        this._paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));
        this._addressInput = this.container.querySelector('[name="address"]');

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.name === 'card' ? 'online' : 'cash';
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