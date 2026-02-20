import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement | null;
    protected _phoneInput: HTMLInputElement | null;
    protected _container: HTMLFormElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        let element: HTMLFormElement;
        
        console.log('ContactsForm constructor container:', container);
        
        if (container.tagName === 'TEMPLATE') {
            const template = container as HTMLTemplateElement;
            element = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
            console.log('Cloned contacts form element:', element);
        } else {
            element = container as HTMLFormElement;
        }
        
        super(element, events);
        this._container = element;
        
        this._emailInput = this._container.querySelector('[name="email"]');
        this._phoneInput = this._container.querySelector('[name="phone"]');

        console.log('ContactsForm constructor:', {
            emailInput: this._emailInput,
            phoneInput: this._phoneInput
        });
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

    get email(): string {
        return this._emailInput?.value || '';
    }

    get phone(): string {
        return this._phoneInput?.value || '';
    }
}