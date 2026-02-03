import { IApi, IApiListResponse, IProduct, IOrderRequest, IOrderResult, IApiError } from '../../types';

export class Commerce {
    private api: IApi;
    private baseUrl: string;

    constructor(api: IApi, baseUrl: string = 'https://larek-api.nomoreparties.co') {
        this.api = api;
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            console.log(`[Commerce] Запрос товаров: ${this.baseUrl}/product/`);
            
            const response = await this.api.get<IApiListResponse<IProduct>>(
                `${this.baseUrl}/product/`
            );
            
            console.log(`[Commerce] Получено товаров: ${response.items.length}`);
            return response.items;
            
        } catch (error) {
            console.error('[Commerce] Ошибка при получении товаров:', error);
            throw new Error(`Не удалось загрузить товары. Проверьте подключение к серверу.`);
        }
    }

    async getProduct(id: string): Promise<IProduct> {
        try {
            console.log(`[Commerce] Запрос товара ${id}`);
            
            const response = await this.api.get<IProduct>(
                `${this.baseUrl}/product/${id}`
            );
            
            console.log(`[Commerce] Товар получен: ${response.title}`);
            return response;
            
        } catch (error) {
            console.error(`[Commerce] Ошибка при получении товара ${id}:`, error);
            throw new Error(`Товар с ID ${id} не найден`);
        }
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        try {
            console.log('[Commerce] Создание заказа:', orderData);
            
            this.validateOrderData(orderData);
            
            const response = await this.api.post<IOrderResult>(
                `${this.baseUrl}/order`,
                orderData,
                'POST'
            );
            
            console.log(`[Commerce] Заказ создан: ID ${response.id}, сумма ${response.total}`);
            return response;
            
        } catch (error) {
            console.error('[Commerce] Ошибка при создании заказа:', error);
            throw this.handleApiError(error, 'Не удалось создать заказ');
        }
    }

    private validateOrderData(orderData: IOrderRequest): void {
        const errors: string[] = [];

        if (!orderData.payment || !['online', 'cash'].includes(orderData.payment)) {
            errors.push('Не указан или неверный способ оплаты');
        }

        if (!orderData.email || !this.isValidEmail(orderData.email)) {
            errors.push('Неверный формат email');
        }

        if (!orderData.phone || orderData.phone.trim().length < 5) {
            errors.push('Не указан телефон');
        }

        if (!orderData.address || orderData.address.trim().length === 0) {
            errors.push('Не указан адрес');
        }

        if (!orderData.total || orderData.total <= 0) {
            errors.push('Неверная сумма заказа');
        }

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('В заказе нет товаров');
        }

        if (errors.length > 0) {
            throw new Error(`Ошибка валидации заказа: ${errors.join(', ')}`);
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private handleApiError(error: unknown, defaultMessage?: string): Error {
        if (error instanceof Error) {
            try {
                const apiError = JSON.parse(error.message) as IApiError;
                return new Error(apiError.error || defaultMessage || 'Ошибка API');
            } catch {
                return error;
            }
        }
        
        return new Error(defaultMessage || 'Неизвестная ошибка API');
    }
}