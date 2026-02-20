import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { Commerce } from './components/Commerce/Commerce';
import { AppState } from './components/Models/AppState';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { CatalogCard } from './components/view/CatalogCard';
import { ModalCard } from './components/view/ModalCard';
import { BasketCard } from './components/view/BasketCard';
import { IProduct, IOrderRequest, TPayment } from './types';
import { CDN_URL, API_URL } from './utils/constants';

//1. ИНИЦИАЛИЗАЦИЯ БРОКЕРА СОБЫТИЙ
const events = new EventEmitter();

//2. ИНИЦИАЛИЗАЦИЯ API И БИЗНЕС-ЛОГИКИ
const api = new Api(API_URL);
const commerce = new Commerce(api);

//3. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ДАННЫХ
const appState = new AppState(events);

//4. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ПРЕДСТАВЛЕНИЯ

//Поиск DOM-элементов
const pageContainer = document.querySelector('.page') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketContainer = document.querySelector('#basket') as HTMLElement;
const orderContainer = document.querySelector('#order') as HTMLElement;
const contactsContainer = document.querySelector('#contacts') as HTMLElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

//Шаблоны
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modalCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

//Проверка наличия всех необходимых элементов
if (!pageContainer || !modalContainer || !basketContainer || !orderContainer || 
    !contactsContainer || !successTemplate || !catalogCardTemplate || 
    !modalCardTemplate || !basketCardTemplate) {
    console.error('Не найдены необходимые DOM-элементы или шаблоны');
    throw new Error('Ошибка инициализации приложения');
}

//Компоненты
const page = new Page(pageContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketContainer, events);
const orderForm = new OrderForm(orderContainer, events);
const contactsForm = new ContactsForm(contactsContainer, events);

//Хранилище для активной модальной карточки
let currentModalCard: ModalCard | null = null;

//Функция для создания компонента Success
const createSuccessComponent = (total: number): HTMLElement => {
    const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!successElement) {
        console.error('Не удалось склонировать шаблон success');
        return document.createElement('div');
    }
    const success = new Success(successElement, events);
    return success.render({ total });
};

//5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

//Функция для создания карточки каталога
const createCatalogCard = (product: IProduct): HTMLElement => {
    const cardElement = catalogCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!cardElement) {
        console.error('Не удалось склонировать шаблон card-catalog');
        return document.createElement('div');
    }
    
    const card = new CatalogCard(cardElement, events);
    const imageUrl = `${CDN_URL}${product.image}`;
    return card.render({ ...product, image: imageUrl });
};

//Функция для создания карточки в модальном окне
const createModalCard = (product: IProduct): HTMLElement => {
    const cardElement = modalCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!cardElement) {
        console.error('Не удалось склонировать шаблон card-preview');
        return document.createElement('div');
    }
    
    currentModalCard = new ModalCard(cardElement, events);
    const imageUrl = `${CDN_URL}${product.image}`;
    const renderedCard = currentModalCard.render({ ...product, image: imageUrl });
    
    const isInBasket = appState.isInBasket(product.id);
    currentModalCard.updateButtonState(isInBasket);
    
    return renderedCard;
};

//Функция для создания карточки в корзине
const createBasketCard = (product: IProduct, index: number): HTMLElement => {
    const cardElement = basketCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!cardElement) {
        console.error('Не удалось склонировать шаблон card-basket');
        return document.createElement('li');
    }
    
    const card = new BasketCard(cardElement, events);
    return card.render(product, index);
};

//6. ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ ДАННЫХ

events.on('catalog:changed', () => {
    const catalogCards = appState.catalog.map(product => createCatalogCard(product));
    page.catalog = catalogCards;
});

events.on('basket:changed', () => {
    const basketItems = appState.basketItems;
    const basketCards = basketItems.map((product, index) => 
        createBasketCard(product, index + 1)
    );
    
    basket.items = basketCards;
    basket.total = appState.basketTotal;
    basket.buttonDisabled = basketItems.length === 0;
    
    if (currentModalCard && modalContainer.classList.contains('modal_active')) {
        const productId = currentModalCard['container'].dataset.id;
        if (productId) {
            currentModalCard.updateButtonState(appState.isInBasket(productId));
        }
    }
});

events.on('counter:changed', (data: { count: number }) => {
    page.counter = data.count;
});

events.on('buyer:any-change', () => {
    const data = appState.buyerData;
    
    if (orderForm) {
        orderForm.payment = data.payment as TPayment;
        orderForm.address = data.address;
    }
    if (contactsForm) {
        contactsForm.email = data.email;
        contactsForm.phone = data.phone;
    }
});

events.on('buyer:validation-error', (data: { field: string; message: string }) => {
    console.log('validation-error', data);
    if (data.field === 'order') {
        orderForm.valid = false;
        orderForm.errors = data.message;
    } else if (data.field === 'contacts') {
        contactsForm.valid = false;
        contactsForm.errors = data.message;
    }
});

events.on('loading:changed', (data: { loading: boolean }) => {
    console.log('Loading:', data.loading);
});

events.on('state:reset', () => {
    basket.items = [];
    orderForm.render({ valid: false, errors: '', payment: '', address: '' });
    contactsForm.render({ valid: false, errors: '', email: '', phone: '' });
});

//7. ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ

events.on('card:select', (data: { id: string }) => {
    const product = appState.getProduct(data.id);
    if (product) {
        const modalCard = createModalCard(product);
        modal.content = modalCard;
        modal.open();
    }
});

events.on('card:action', (data: { id: string }) => {
    const product = appState.getProduct(data.id);
    if (!product) return;

    if (appState.isInBasket(data.id)) {
        appState.removeFromBasket(data.id);
    } else {
        appState.addToBasket(product);
    }
});

events.on('basket:remove', (data: { id: string }) => {
    appState.removeFromBasket(data.id);
});

events.on('page:basket-open', () => {
    const basketCards = appState.basketItems.map((product, index) => 
        createBasketCard(product, index + 1)
    );
    
    basket.items = basketCards;
    basket.total = appState.basketTotal;
    basket.buttonDisabled = appState.basketItems.length === 0;
    
    modal.content = basket.render({
        items: basketCards,
        total: appState.basketTotal
    });
    modal.open();
});

events.on('basket:order', () => {
    if (appState.basketItems.length === 0) return;
    
    const buyerData = appState.buyerData;
    
    orderForm.valid = false;
    orderForm.errors = '';
    
    const formElement = orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: false,
        errors: ''
    });
    
    modal.content = formElement;
    modal.open();
});

events.on('order:change', (data: { field: string; value: string }) => {
    console.log('order:change', data);
    if (data.field === 'address') {
        appState.setAddress(data.value);
    }
    
    //Проверяем валидность формы и обновляем кнопку
    const isValid = appState.isOrderStepValid();
    orderForm.valid = isValid;
    
    //Если форма невалидна, показываем сообщение
    if (!isValid) {
        if (!appState.buyerData.payment) {
            orderForm.errors = 'Выберите способ оплаты';
        } else if (!appState.buyerData.address) {
            orderForm.errors = 'Укажите адрес доставки';
        }
    } else {
        orderForm.errors = '';
    }
});

events.on('order:payment-change', (data: { payment: TPayment }) => {
    console.log('order:payment-change', data.payment);
    appState.setPayment(data.payment);
    
    //Проверяем валидность формы и обновляем кнопку
    const isValid = appState.isOrderStepValid();
    orderForm.valid = isValid;
    
    //Если форма невалидна, показываем сообщение
    if (!isValid) {
        if (!appState.buyerData.address) {
            orderForm.errors = 'Необходимо указать адрес';
        }
    } else {
        orderForm.errors = '';
    }
});

events.on('order:submit', () => {
    console.log('order:submit');
    const isValid = appState.validateOrderStep();
    if (isValid) {
        contactsForm.valid = false;
        contactsForm.errors = '';
        
        const formElement = contactsForm.render({
            email: appState.buyerData.email,
            phone: appState.buyerData.phone,
            valid: false,
            errors: ''
        });
        
        modal.content = formElement;
    }
});

events.on('contacts:change', (data: { field: string; value: string }) => {
    console.log('contacts:change', data);
    if (data.field === 'email') {
        appState.setEmail(data.value);
    } else if (data.field === 'phone') {
        appState.setPhone(data.value);
    }
    
    //Валидация для второго шага
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appState.buyerData.email);
    const phoneValid = /^\+?[0-9]{10,15}$/.test(appState.buyerData.phone.replace(/[\s()-]/g, ''));
    const isValid = emailValid && phoneValid;
    
    contactsForm.valid = isValid;
    
    //Показываем сообщения об ошибках
    if (!isValid) {
        if (!emailValid && !phoneValid) {
            contactsForm.errors = 'Укажите email и телефон';
        } else if (!emailValid) {
            contactsForm.errors = 'Укажите корректный email';
        } else if (!phoneValid) {
            contactsForm.errors = 'Укажите корректный телефон';
        }
    } else {
        contactsForm.errors = '';
    }
});

events.on('contacts:submit', async () => {
    console.log('contacts:submit');
    const isValid = appState.validateOrder();
    if (!isValid) return;

    try {
        appState.setLoading(true);
        
        const orderData: IOrderRequest = {
            payment: appState.buyerData.payment,
            email: appState.buyerData.email,
            phone: appState.buyerData.phone,
            address: appState.buyerData.address,
            total: appState.basketTotal,
            items: appState.basketIds
        };

        const result = await commerce.createOrder(orderData);
        
        modal.content = createSuccessComponent(result.total);
        
        appState.clearBasket();
        appState.clearBuyer();
        
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
    } finally {
        appState.setLoading(false);
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
    orderForm.render({ valid: false, errors: '', payment: '', address: '' });
    contactsForm.render({ valid: false, errors: '', email: '', phone: '' });
    currentModalCard = null;
});

//8. ЗАГРУЗКА НАЧАЛЬНЫХ ДАННЫХ
(async () => {
    try {
        appState.setLoading(true);
        const products = await commerce.getProducts();
        appState.setCatalog(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    } finally {
        appState.setLoading(false);
    }
})();