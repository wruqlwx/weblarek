import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormState {
    valid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<IFormState> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errors: HTMLElement | null;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submitButton = container.querySelector('button[type="submit"]');
        this._errors = container.querySelector('.form__errors');

        console.log('Form constructor:', {
            container: this.container,
            submitButton: this._submitButton,
            errors: this._errors
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });

        this.container.addEventListener('input', (evt) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`${this.container.name}:change`, { field, value });
        });
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
        }
    }

    render(state: Partial<T & IFormState>): HTMLElement {
        const { valid, errors, ...inputs } = state;
        if (valid !== undefined) this.valid = valid;
        if (errors !== undefined) this.errors = errors;
        Object.assign(this, inputs);
        return this.container;
    }
}