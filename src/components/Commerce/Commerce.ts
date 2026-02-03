import { IApi, IApiListResponse, IProduct, IOrderRequest, IOrderResult, IApiError } from '../../types';

export class Commerce {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        try {            
            const response = await this.api.get<IApiListResponse<IProduct>>(
                '/product/'
            );
            
            return response.items;
            
        } catch (error) {
            console.error('[Commerce] Ошибка при получении товаров:', error);
            throw new Error(`Не удалось загрузить товары. Проверьте подключение к серверу.`);
        }
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        try {            
            const response = await this.api.post<IOrderResult>(
                '/order',
                orderData
            );
            
            return response;
            
        } catch (error) {
            console.error('[Commerce] Ошибка при создании заказа:', error);
            throw this.handleApiError(error, 'Не удалось создать заказ');
        }
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