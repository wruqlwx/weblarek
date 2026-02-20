import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types';

export class BuyerModel implements IBuyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getPayment(): TPayment {
        return this.payment;
    }
    
    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:changed', { field: 'payment', value: payment });
        this.events.emit('buyer:any-change', this.getData());
    }
    
    getEmail(): string {
        return this.email;
    }
    
    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed', { field: 'email', value: email });
        this.events.emit('buyer:any-change', this.getData());
    }
    
    getPhone(): string {
        return this.phone;
    }
    
    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed', { field: 'phone', value: phone });
        this.events.emit('buyer:any-change', this.getData());
    }
    
    getAddress(): string {
        return this.address;
    }
    
    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed', { field: 'address', value: address });
        this.events.emit('buyer:any-change', this.getData());
    }

    // Сохранение данных в модели
    saveData(data: Partial<{payment: TPayment; email: string; phone: string; address: string}>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit('buyer:any-change', this.getData());
    }

    // Получение всех данных покупателя
    getData(): {payment: TPayment; email: string; phone: string; address: string} {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    // Очистка данных покупателя
    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:clear', this.getData());
        this.events.emit('buyer:any-change', this.getData());
    }

    // Валидация данных покупателя (простая проверка на заполненность)
    validate(): boolean {
        // Проверка способа оплаты
        if (!this.payment || (this.payment !== 'online' && this.payment !== 'cash')) {
            return false;
        }

        // Проверка адреса
        if (!this.address || this.address.trim().length === 0) {
            return false;
        }

        // Проверка email
        if (!this.email || this.email.trim().length === 0) {
            return false;
        }

        // Проверка телефона
        if (!this.phone || this.phone.trim().length === 0) {
            return false;
        }

        return true;
    }
}