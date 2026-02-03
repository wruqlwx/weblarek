export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IBasket {
    add(item: IProduct): void;
    remove(id: string): void;
    clear(): void;
    getTotalPrice(): number;
    getItemsCount(): number;
    hasItem(id: string): boolean;
    getItems(): IProduct[];
}

export interface IApiListResponse<T> {
    total: number;
    items: T[];
}

export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IApiError {
    error: string;
}

export type ApiResponse<T> = T | IApiError;