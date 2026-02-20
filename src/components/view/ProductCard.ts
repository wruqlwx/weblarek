import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export abstract class ProductCard extends Card {
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _button: HTMLButtonElement | null;
    protected _id: string = ''; // Инициализируем пустой строкой

    constructor(
        container: HTMLElement, 
        protected events: IEvents,
        protected onClick?: () => void,
        protected onAction?: () => void
    ) {
        super(container, events);
        
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');

        // Для карточки каталога (которая сама является кнопкой)
        if (container.classList.contains('gallery__item') && onClick) {
            container.addEventListener('click', (evt) => {
                evt.preventDefault();
                onClick();
            });
        }

        // Для кнопки внутри карточки
        if (this._button && onAction) {
            this._button.addEventListener('click', (evt) => {
                evt.stopPropagation();
                onAction();
            });
        }
    }

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесценно';
                if (this._button) {
                    this._button.disabled = true;
                    this._button.textContent = 'Недоступно';
                }
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            // Удаляем все классы категорий перед добавлением нового
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

    setButtonState(isInBasket: boolean) {
        if (this._button && !this._button.disabled) {
            this._button.textContent = isInBasket ? 'Удалить из корзины' : 'Купить';
        }
    }

    render(data: IProduct): HTMLElement {
        this._id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        return this.container;
    }
}