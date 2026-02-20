import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types';

export class BuyerModel implements IBuyer {
    protected _payment: TPayment = '';
    protected _email: string = '';
    protected _phone: string = '';
    protected _address: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getPayment(): TPayment {
        return this._payment;
    }

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('buyer:changed', { field: 'payment', value: payment });
        this.events.emit('buyer:any-change', this.getData());
    }

    getEmail(): string {
        return this._email;
    }

    setEmail(email: string): void {
        this._email = email;
        this.events.emit('buyer:changed', { field: 'email', value: email });
        this.events.emit('buyer:any-change', this.getData());
    }

    getPhone(): string {
        return this._phone;
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.events.emit('buyer:changed', { field: 'phone', value: phone });
        this.events.emit('buyer:any-change', this.getData());
    }

    getAddress(): string {
        return this._address;
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('buyer:changed', { field: 'address', value: address });
        this.events.emit('buyer:any-change', this.getData());
    }

    saveData(data: Partial<{ payment: TPayment; email: string; phone: string; address: string; }>): void {
        if (data.payment !== undefined) this.setPayment(data.payment);
        if (data.email !== undefined) this.setEmail(data.email);
        if (data.phone !== undefined) this.setPhone(data.phone);
        if (data.address !== undefined) this.setAddress(data.address);
    }

    getData(): { payment: TPayment; email: string; phone: string; address: string; } {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events.emit('buyer:clear', this.getData());
        this.events.emit('buyer:any-change', this.getData());
    }

    validate(): boolean {
        const isPaymentValid = this._payment === 'online' || this._payment === 'cash';
        const isAddressValid = this._address.trim().length > 0;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email);
        const isPhoneValid = /^\+?[0-9]{10,15}$/.test(this._phone.replace(/[\s()-]/g, ''));

        if (!isPaymentValid || !isAddressValid) {
            let message = '';
            if (!isPaymentValid && !isAddressValid) {
                message = 'Выберите способ оплаты и укажите адрес';
            } else if (!isPaymentValid) {
                message = 'Выберите способ оплаты';
            } else if (!isAddressValid) {
                message = 'Укажите адрес доставки';
            }
            
            this.events.emit('buyer:validation-error', { 
                field: 'order',
                message: message
            });
            return false;
        }

        if (!isEmailValid || !isPhoneValid) {
            let message = '';
            if (!isEmailValid && !isPhoneValid) {
                message = 'Укажите email и телефон';
            } else if (!isEmailValid) {
                message = 'Укажите корректный email';
            } else if (!isPhoneValid) {
                message = 'Укажите корректный телефон';
            }
            
            this.events.emit('buyer:validation-error', { 
                field: 'contacts',
                message: message
            });
            return false;
        }

        return true;
    }

    validateOrder(): boolean {
        const isPaymentValid = this._payment === 'online' || this._payment === 'cash';
        const isAddressValid = this._address.trim().length > 0;

        if (!isPaymentValid || !isAddressValid) {
            let message = '';
            if (!isPaymentValid && !isAddressValid) {
                message = 'Выберите способ оплаты и укажите адрес';
            } else if (!isPaymentValid) {
                message = 'Выберите способ оплаты';
            } else if (!isAddressValid) {
                message = 'Укажите адрес доставки';
            }
            
            this.events.emit('buyer:validation-error', { 
                field: 'order',
                message: message
            });
            return false;
        }

        return true;
    }

    isOrderValid(): boolean {
        const isPaymentValid = this._payment === 'online' || this._payment === 'cash';
        const isAddressValid = this._address.trim().length > 0;
        return isPaymentValid && isAddressValid;
    }
}