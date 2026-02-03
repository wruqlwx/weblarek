import { IBuyer, TPayment } from '../../types';

export class Buyer implements IBuyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    getPayment(): TPayment {
        return this.payment;
    }
    
    setPayment(payment: TPayment): void {
        this.payment = payment;
    }
    
    getEmail(): string {
        return this.email;
    }
    
    setEmail(email: string): void {
        this.email = email;
    }
    
    getPhone(): string {
        return this.phone;
    }
    
    setPhone(phone: string): void {
        this.phone = phone;
    }
    
    getAddress(): string {
        return this.address;
    }
    
    setAddress(address: string): void {
        this.address = address;
    }

    //Сохранение данных в модели
    saveData(data: Partial<{payment: TPayment; email: string; phone: string; address: string}>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    //Получение всех данных покупателя
    getData(): {payment: TPayment; email: string; phone: string; address: string} {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    //Очистка данных покупателя
    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    //Валидация данных покупателя
    validate(): boolean {
        //Проверка способа оплаты
        if (!this.payment || (this.payment !== 'online' && this.payment !== 'cash')) {
            return false;
        }

        //Проверка email
        if (!this.email || this.email.trim().length === 0) {
            return false;
        }

        //Проверка телефона
        if (!this.phone || this.phone.trim().length === 0) {
            return false;
        }

        //Проверка адреса
        if (!this.address || this.address.trim().length === 0) {
            return false;
        }

        return true;
    }
}