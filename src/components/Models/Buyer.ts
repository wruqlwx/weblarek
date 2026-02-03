import { IBuyer, TPayment } from '../../types';

export class Buyer implements IBuyer {
    payment: TPayment = '';
    email: string = '';
    phone: string = '';
    address: string = '';

    //Сохранение данных в модели
    saveData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    //Получение всех данных покупателя
    getData(): IBuyer {
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            return false;
        }

        //Проверка телефона (минимальная валидация)
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!this.phone || !phoneRegex.test(this.phone) || this.phone.length < 5) {
            return false;
        }

        //Проверка адреса
        if (!this.address || this.address.trim().length === 0) {
            return false;
        }

        return true;
    }
}