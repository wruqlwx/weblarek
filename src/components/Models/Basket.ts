import { IProduct, IBasket } from '../../types';

export class Basket implements IBasket {
    private items: IProduct[] = [];

    //Получение массива товаров в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    //Добавление товара в корзину
    add(item: IProduct): void {
        this.items.push(item);
    }

    //Удаление товара из корзины по id
    remove(id: string): void {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    //Очистка корзины
    clear(): void {
        this.items = [];
    }

    //Получение стоимости всех товаров в корзине
    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    //Получение количества товаров в корзине
    getItemsCount(): number {
        return this.items.length;
    }

    //Проверка наличия товара в корзине по id
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}