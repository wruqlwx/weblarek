import { Form } from './Form';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLFormElement;
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = Component.cloneTemplate<HTMLFormElement>(template);
        } else {
            element = container as HTMLFormElement;
        }
        
        super(element, events);
        
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