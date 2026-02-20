import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export abstract class Card extends Component<IProduct> {
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _image?: HTMLImageElement | null;
    protected _category?: HTMLElement | null;
    protected _button?: HTMLButtonElement | null;
    protected _description?: HTMLElement | null;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        this._description = container.querySelector('.card__text');

        //Для карточки каталога
        if (container.classList && container.classList.contains('gallery__item')) {
            container.addEventListener('click', (evt) => {
                evt.preventDefault();
                this.events.emit('card:select', { id: this.container.dataset.id });
            });
        }

        //Для кнопки внутри карточки
        if (this._button) {
            this._button.addEventListener('click', (evt) => {
                evt.stopPropagation();
                this.events.emit('card:action', { id: this.container.dataset.id });
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
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
            //Удаляем все классы категорий перед добавлением нового
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

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    setButtonState(isInBasket: boolean) {
        if (this._button && !this._button.disabled) {
            this._button.textContent = isInBasket ? 'Удалить из корзины' : 'Купить';
        }
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        this.id = data.id;
        return this.container;
    }
}