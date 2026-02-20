import { Form } from './Form';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement | null;
    protected _phoneInput: HTMLInputElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLFormElement;
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = Component.cloneTemplate<HTMLFormElement>(template);
        } else {
            element = container as HTMLFormElement;
        }
        
        super(element, events);
        
        this._emailInput = this.container.querySelector('[name="email"]');
        this._phoneInput = this.container.querySelector('[name="phone"]');
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }
}