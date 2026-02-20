import { IEvents } from '../base/Events';
import { IProduct, IOrderForm, TPayment } from '../../types';
import { CatalogModel } from './Catalog';
import { BasketModel } from './Basket';
import { BuyerModel } from './Buyer';

export class AppState {
    protected _catalog: CatalogModel;
    protected _basket: BasketModel;
    protected _buyer: BuyerModel;
    protected _loading: boolean = false;
    protected _selectedProductId: string | null = null; // <-- Добавить
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._catalog = new CatalogModel(events);
        this._basket = new BasketModel(events);
        this._buyer = new BuyerModel(events);
    }

    get catalog(): IProduct[] {
        return this._catalog.items;
    }

    get basketItems(): IProduct[] {
        return this._basket.getItems();
    }

    get basketCount(): number {
        return this._basket.getItemsCount();
    }

    get basketTotal(): number {
        return this._basket.getTotalPrice();
    }

    get basketIds(): string[] {
        return this._basket.getItemsIds();
    }

    get buyerData() {
        return this._buyer.getData();
    }

    get loading(): boolean {
        return this._loading;
    }

    get selectedProductId(): string | null { // <-- Добавить геттер
        return this._selectedProductId;
    }

    set selectedProductId(value: string | null) { // <-- Добавить сеттер
        this._selectedProductId = value;
    }

    setCatalog(items: IProduct[]): void {
        this._catalog.items = items;
    }

    getProduct(id: string): IProduct | undefined {
        return this._catalog.getProduct(id);
    }

    addToBasket(item: IProduct): void {
        if (!this._basket.hasItem(item.id)) {
            this._basket.add(item);
            this.events.emit('counter:changed', { count: this.basketCount });
        }
    }

    removeFromBasket(id: string): void {
        this._basket.remove(id);
        this.events.emit('counter:changed', { count: this.basketCount });
    }

    clearBasket(): void {
        this._basket.clear();
        this.events.emit('counter:changed', { count: 0 });
    }

    isInBasket(id: string): boolean {
        return this._basket.hasItem(id);
    }

    setPayment(payment: TPayment): void {
        this._buyer.setPayment(payment);
    }

    setAddress(address: string): void {
        this._buyer.setAddress(address);
    }

    setEmail(email: string): void {
        this._buyer.setEmail(email);
    }

    setPhone(phone: string): void {
        this._buyer.setPhone(phone);
    }

    saveOrderForm(data: Partial<IOrderForm>): void {
        if (data.payment !== undefined) this._buyer.setPayment(data.payment);
        if (data.address !== undefined) this._buyer.setAddress(data.address);
        if (data.email !== undefined) this._buyer.setEmail(data.email);
        if (data.phone !== undefined) this._buyer.setPhone(data.phone);
    }

    clearBuyer(): void {
        this._buyer.clear();
    }

    validateOrder(): boolean {
        return this._buyer.validate();
    }

    validateOrderStep(): boolean {
        const data = this._buyer.getData();
        return !!(data.payment && data.address);
    }

    setLoading(loading: boolean): void {
        this._loading = loading;
        this.events.emit('loading:changed', { loading });
    }

    reset(): void {
        this.clearBasket();
        this.clearBuyer();
        this._selectedProductId = null; // <-- Добавить сброс
        this.events.emit('state:reset');
    }
}