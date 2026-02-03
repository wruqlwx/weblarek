import { IProduct } from "../../types";

export class Catalog {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    //Сохранение массива товаров
    saveItems(items: IProduct[]): void {
        this.items = items;
    }

    //Получение массива товаров из модели
    getItems(): IProduct[] {
        return this.items;
    }

    //Получение одного товара по его id
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    //Сохранение товара для подробного отображения
    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
    }

    //Получение товара для подробного отображения
    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }

}