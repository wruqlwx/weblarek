import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export abstract class BaseProductCard extends Card {
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            this._category.className = 'card__category';
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this.title;
        }
    }

    render(data: IProduct): HTMLElement {
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        return this.container;
    }
}