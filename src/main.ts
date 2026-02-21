import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { Commerce } from './components/Commerce/Commerce';
import { AppState } from './components/Models/AppState';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
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
import { cloneTemplate } from './utils/utils';

// ==============================================
// 1. ИНИЦИАЛИЗАЦИЯ БРОКЕРА СОБЫТИЙ
// ==============================================
const events = new EventEmitter();

// ==============================================
// 2. ИНИЦИАЛИЗАЦИЯ API И БИЗНЕС-ЛОГИКИ
// ==============================================
const api = new Api(API_URL);
const commerce = new Commerce(api);

// ==============================================
// 3. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ДАННЫХ
// ==============================================
const appState = new AppState(events);

// ==============================================
// 4. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ПРЕДСТАВЛЕНИЯ
// ==============================================

// Поиск DOM-элементов
const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketContainer = document.querySelector('#basket') as HTMLElement;
const orderContainer = document.querySelector('#order') as HTMLFormElement;
const contactsContainer = document.querySelector('#contacts') as HTMLFormElement;
const successContainer = document.querySelector('#success') as HTMLElement;

// Шаблоны
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const modalCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// Проверка наличия всех необходимых элементов
if (!headerContainer || !galleryContainer || !modalContainer || !basketContainer || 
    !orderContainer || !contactsContainer || !successContainer || !catalogCardTemplate || 
    !modalCardTemplate || !basketCardTemplate) {
    console.error('Не найдены необходимые DOM-элементы или шаблоны');
    throw new Error('Ошибка инициализации приложения');
}

// Компоненты
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketContainer, events);
const orderForm = new OrderForm(orderContainer, events);
const contactsForm = new ContactsForm(contactsContainer, events);
const success = new Success(successContainer, events);

// Статичная карточка для модального окна
const modalCard = new ModalCard(
    cloneTemplate(modalCardTemplate),
    events,
    () => {
        const selectedProduct = appState.selectedProductId ? 
            appState.getProduct(appState.selectedProductId) : null;
        if (selectedProduct) {
            events.emit('card:action', { id: selectedProduct.id });
        }
    }
);

// ==============================================
// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==============================================

// Функция для создания карточки каталога
const createCatalogCard = (product: IProduct): HTMLElement => {
    const cardElement = cloneTemplate(catalogCardTemplate);
    const card = new CatalogCard(
        cardElement, 
        events,
        () => events.emit('card:select', { id: product.id }),
        () => events.emit('card:action', { id: product.id })
    );
    
    const imageUrl = `${CDN_URL}${product.image}`;
    return card.render({ ...product, image: imageUrl });
};

// Функция для создания карточки в корзине
const createBasketCard = (product: IProduct, index: number): HTMLElement => {
    const cardElement = cloneTemplate(basketCardTemplate);
    const card = new BasketCard(
        cardElement, 
        events,
        () => events.emit('basket:remove', { id: product.id })
    );
    
    return card.render(product, index);
};

// ==============================================
// 6. ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ ДАННЫХ
// ==============================================

events.on('catalog:changed', () => {
    const catalogCards = appState.catalog.map(product => createCatalogCard(product));
    gallery.items = catalogCards;
});

events.on('basket:changed', () => {
    header.counter = appState.basketCount;
    
    const selectedProduct = appState.selectedProductId ? 
        appState.getProduct(appState.selectedProductId) : null;
    if (selectedProduct) {
        modalCard.updateButtonState(appState.isInBasket(selectedProduct.id));
    }
});

events.on('buyer:any-change', () => {
    const data = appState.buyerData;
    orderForm.payment = data.payment as TPayment;
    orderForm.address = data.address;
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    
    // Валидация после обновления данных
    const orderValidation = appState.validateOrderStep();
    orderForm.valid = orderValidation.isValid;
    orderForm.errors = orderValidation.isValid ? '' : Object.values(orderValidation.errors).join('; ');
    
    const contactsValidation = appState.validateOrder();
    contactsForm.valid = contactsValidation.isValid;
    contactsForm.errors = contactsValidation.isValid ? '' : Object.values(contactsValidation.errors).join('; ');
});

events.on('loading:changed', (data: { loading: boolean }) => {
    console.log('Loading:', data.loading);
});

events.on('state:reset', () => {
    basket.items = [];
    orderForm.render({ valid: false, errors: '', payment: '', address: '' });
    contactsForm.render({ valid: false, errors: '', email: '', phone: '' });
});

// ==============================================
// 7. ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ
// ==============================================

events.on('card:select', (data: { id: string }) => {
    const product = appState.getProduct(data.id);
    if (product) {
        appState.selectedProductId = product.id;
        
        const imageUrl = `${CDN_URL}${product.image}`;
        const renderedCard = modalCard.render({ ...product, image: imageUrl });
        modalCard.updateButtonState(appState.isInBasket(product.id));
        
        modal.content = renderedCard;
        modal.open();
    }
});

events.on('card:action', (data: { id: string }) => {
    const product = appState.getProduct(data.id);
    if (!product) return;

    if (appState.isInBasket(data.id)) {
        appState.removeFromBasket(data.id);
        modal.close(); // Закрываем после удаления
    } else {
        appState.addToBasket(product);
    }
});

events.on('basket:remove', (data: { id: string }) => {
    appState.removeFromBasket(data.id);
});

events.on('header:basket-open', () => {
    const basketCards = appState.basketItems.map((product, index) => 
        createBasketCard(product, index + 1)
    );
    basket.items = basketCards;
    basket.total = appState.basketTotal;
    
    modal.content = basket.render({
        items: basketCards,
        total: appState.basketTotal
    });
    modal.open();
});

events.on('basket:order', () => {
    if (appState.basketItems.length === 0) return;
    
    const buyerData = appState.buyerData;
    const validation = appState.validateOrderStep();
    
    const formElement = orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: validation.isValid,
        errors: validation.isValid ? '' : Object.values(validation.errors).join('; ')
    });
    
    modal.content = formElement;
    modal.open();
});

events.on('order:change', (data: { field: string; value: string }) => {
    if (data.field === 'address') {
        appState.setAddress(data.value);
    }
});

events.on('order:payment-change', (data: { payment: TPayment }) => {
    appState.setPayment(data.payment);
});

events.on('order:submit', () => {
    const validation = appState.validateOrderStep();
    if (validation.isValid) {
        const contactsValidation = appState.validateOrder();
        const formElement = contactsForm.render({
            email: appState.buyerData.email,
            phone: appState.buyerData.phone,
            valid: contactsValidation.isValid,
            errors: contactsValidation.isValid ? '' : Object.values(contactsValidation.errors).join('; ')
        });
        modal.content = formElement;
    }
});

events.on('contacts:change', (data: { field: string; value: string }) => {
    if (data.field === 'email') {
        appState.setEmail(data.value);
    } else if (data.field === 'phone') {
        appState.setPhone(data.value);
    }
});

events.on('contacts:submit', async () => {
    const validation = appState.validateOrder();
    if (!validation.isValid) {
        contactsForm.valid = false;
        contactsForm.errors = Object.values(validation.errors).join('; ');
        return;
    }

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
        
        success.total = result.total;
        modal.content = success.render({ total: result.total });
        
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
});

// ==============================================
// 8. ЗАГРУЗКА НАЧАЛЬНЫХ ДАННЫХ
// ==============================================
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