# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
В проекте используется 2 сущности, описывающие данные - товар и покупатель.

#### Интерфейс Product 
Product описывает товар: его уникальный id, описание, название, изображение в карточке, категорию и цену.
```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### Интерфейс Buyer
Buyer описывает данные покупателя: его выбор способа оплаты, адрес доставки, email и телефон. Содержит методы: сохранение данных в модели, получение всех данных покупателя, очистка данных покупателя, валидация данных.
```typescript
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

#### Класс Catalog
Класс для хранения товаров, которые можно купить в приложении.

Конструктор:
`constructor()`
Поля класса:
`private items: IProduct[] = []` - массив всех товаров в каталоге

`private selectedItem: IProduct | null = null` - выбранный товар для детального просмотра

Методы класса:
`saveItems(items: IProduct[]): void` - сохранение массива товаров в каталог

`getItems(): IProduct[]` - получение всех товаров из каталога

`getItemById(id: string): IProduct | undefined` - поиск товара по его уникальному ID

`setSelectedItem(item: IProduct): void` - сохранение товара для подробного отображения

`getSelectedItem(): IProduct | null` - получение товара для подробного отображения

`clearSelectedItem(): void` - сброс выбранного товара

#### Класс Basket
Класс для хранения товаров, выбранных покупателем для покупки.

Конструктор:
`constructor()`

Поля класса:

`items: IProduct[] = []` - массив товаров в корзине (публичное поле согласно интерфейсу)

Методы класса:
`add(item: IProduct): void` - добавление товара в корзину

`remove(id: string): void` - удаление товара из корзины по его ID

`clear(): void` - полная очистка корзины

`getTotalPrice(): number` - расчет общей стоимости всех товаров в корзине

`getItemsCount(): number` - получение количества товаров в корзине

`hasItem(id: string): boolean` - проверка наличия товара в корзине по ID

`getItems(): IProduct[]` - получение всех товаров из корзины

#### Класс Buyer
Класс Buyer нужен для хранения и валидации данных покупателя.

Конструктор:
`constructor()`

Поля класса:
`payment: TPayment = ''` - способ оплаты покупателя

`email: string = ''` - email покупателя

`phone: string = ''` - телефон покупателя

`address: string = ''` - адрес доставки

Методы класса:
`saveData(data: Partial<IBuyer>): void` - сохранение данных покупателя (частичное обновление)

`getData(): IBuyer` - получение всех данных покупателя

`clear(): void` - очистка всех данных покупателя

`validate(): boolean` - валидация данных покупателя:
Проверка способа оплаты ('online' или 'cash')
Проверка формата email
Проверка наличия и формата телефона
Проверка наличия адреса доставки

### Слой коммуникации

#### Класс Commerce

Класс Commerce отвечает за взаимодействие с API сервера. 
`constructor(api: IApi, baseUrl: string = 'http://localhost:3000/api/weblarek')`
`api: IApi` - экземпляр класса для выполнения HTTP-запросов

`baseUrl: string` - базовый URL API (по умолчанию соответствует локальному серверу разработки)

Поля класса:
`private api: IApi` - экземпляр HTTP-клиента

`private baseUrl: string` - базовый URL API 

Методы класса:
`getProducts(): Promise<IProduct[]>` - получает каталог товаров с сервера.

`getProduct(id: string): Promise<IProduct>` - получает информацию о конкретном товаре.

`createOrder(orderData: IOrderRequest): Promise<IOrderResult>` - создает новый заказ на сервере.

Приватные методы:
`private validateOrderData(orderData: IOrderRequest): void` - валидация данных заказа

`private isValidEmail(email: string): boolean` - проверка формата email

`private handleApiError(error: unknown, defaultMessage?: string): Error` - обработка ошибок API

### Типы данных
#### Базовые типы 
```typescript
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'online' | 'cash' | '';
```
#### Все типы 
Интерфейс для товара
```typescript
export interface IProduct {
    id: string; //Уникальный идентификатор товара
    description: string; //Подробное описание товара
    image: string; //URL изображения товара
    title: string; //Название товара
    category: string; //Категория товара
    price: number | null; //Цена товара (может быть null)
}
```

Интерфейс для покупателя
```typescript
export interface IBuyer {
    payment: TPayment; //Способ оплаты: 'online' или 'cash'
    email: string; //Email покупателя
    phone: string; //Телефон покупателя
    address: string; //Адрес доставки
}
```

Интерфейс для корзины
```typescript
export interface IBasket {
    items: IProduct[]; //Массив товаров в корзине
    add(item: IProduct): void; //Добавление товара в корзину
    remove(id: string): void; //Удаление товара по ID
    clear(): void; //Очистка корзины
    getTotalPrice(): number; //Получение общей стоимости
    getItemsCount(): number; //Получение количества товаров
    hasItem(id: string): boolean; //Проверка наличия товара по ID
    getItems(): IProduct[]; //Получение всех товаров
}
```

Тип для запроса на создание заказа
```typescript
export interface IOrderRequest {
    payment: TPayment; //Способ оплаты
    email: string; //Email покупателя
    phone: string; //Телефон покупателя
    address: string; //Адрес доставки
    total: number; //Общая сумма заказа
    items: string[]; //Массив ID товаров в заказе
}
```

Тип для ответа при создании заказа
```typescript
export interface IOrderResult {
    id: string; //ID созданного заказа
    total: number; //Сумма заказа
}
```

Интерфейс для ответа API со списком элементов
```typescript
export interface IApiListResponse<T> {
    total: number; //Общее количество элементов
    items: T[]; //Массив элементов
}
```

Интерфейс для ошибок API
```typescript
export interface IApiError {
    error: string; //Сообщение об ошибке
}
```

Универсальный тип ответа API
```typescript
export type ApiResponse<T> = T | IApiError;
```

## Слой представления (View)

### Базовые классы представления

#### Класс Card (абстрактный)
Базовый класс для всех типов карточек товаров.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает корневой DOM-элемент и брокер событий

Поля:
`_title: HTMLElement | null` - элемент заголовка
`_price: HTMLElement | null` - элемент цены
`_image: HTMLImageElement | null` - элемент изображения
`_category: HTMLElement | null` - элемент категории
`_button: HTMLButtonElement | null` - кнопка действия
`_description: HTMLElement | null` - элемент описания

Сеттеры:
`set id(value: string)` - устанавливает ID товара в data-атрибут
`set title(value: string)` - устанавливает заголовок
`set price(value: number | null)` - устанавливает цену (форматирует, обрабатывает null)
`set category(value: string)` - устанавливает категорию с соответствующим CSS классом
`set image(value: string)` - устанавливает изображение
`set description(value: string)` - устанавливает описание
`setButtonState(isInBasket: boolean)` - обновляет состояние кнопки ("Купить" / "Удалить из корзины")

События:
`card:select` - клик по карточке (открытие модального окна)
`card:action` - клик по кнопке действия

#### Класс Form (абстрактный)
Базовый класс для всех форм приложения.

Конструктор:
`constructor(container: HTMLFormElement, events: IEvents)` - принимает форму и брокер событий

Поля:
`_submitButton: HTMLButtonElement | null` - кнопка отправки
`_errors: HTMLElement | null` - контейнер для ошибок

Сеттеры:
`set valid(value: boolean)` - активирует/деактивирует кнопку отправки
`set errors(value: string)` - устанавливает текст ошибки

События:
`[formName]:submit` - отправка формы
`[formName]:change` - изменение поля формы

### Компоненты представления

#### Класс CatalogCard (наследует Card)
Карточка товара для каталога на главной странице.

#### Класс ModalCard (наследует Card)
Карточка товара для отображения в модальном окне.

Методы:
`updateButtonState(isInBasket: boolean)` - обновляет состояние кнопки в модальном окне

#### Класс BasketCard (наследует Card)
Карточка товара для отображения в корзине.

Поля:
`_index: HTMLElement | null` - порядковый номер товара
`_deleteButton: HTMLButtonElement | null` - кнопка удаления

Сеттеры:
`set index(value: number)` - устанавливает порядковый номер

События:
`basket:remove` - удаление товара из корзины

#### Класс Modal
Компонент модального окна.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает контейнер модального окна

Поля:
`_closeButton: HTMLButtonElement` - кнопка закрытия
`_content: HTMLElement` - контейнер для контента

Методы:
`set content(value: HTMLElement)` - устанавливает контент
`open()` - открывает модальное окно
`close()` - закрывает модальное окно

События:
`modal:open` - открытие модального окна
`modal:close` - закрытие модального окна

#### Класс Page
Компонент главной страницы.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает корневой элемент страницы

Поля:
`_catalog: HTMLElement` - контейнер каталога
`_basketCounter: HTMLElement` - счетчик корзины
`_basketButton: HTMLButtonElement | null` - кнопка открытия корзины

Сеттеры:
`set catalog(items: HTMLElement[])` - отрисовывает каталог
`set counter(value: number)` - обновляет счетчик корзины

События:
`page:basket-open` - открытие корзины

#### Класс Basket
Компонент корзины.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает контейнер корзины

Поля:
`_list: HTMLElement | null` - список товаров
`_total: HTMLElement | null` - общая стоимость
`_button: HTMLButtonElement | null` - кнопка оформления

Сеттеры:
`set items(items: HTMLElement[])` - отрисовывает список товаров
`set total(value: number)` - устанавливает общую стоимость
`set buttonDisabled(value: boolean)` - активирует/деактивирует кнопку

События:
`basket:order` - оформление заказа

#### Класс OrderForm (наследует Form)
Форма первого шага оформления заказа (способ оплаты и адрес).

Поля:
`_paymentButtons: HTMLButtonElement[]` - кнопки выбора оплаты
`_addressInput: HTMLInputElement | null` - поле ввода адреса

Сеттеры:
`set payment(value: TPayment)` - устанавливает выбранный способ оплаты
`set address(value: string)` - устанавливает адрес

События:
`order:payment-change` - изменение способа оплаты
`order:submit` - переход к следующему шагу

#### Класс ContactsForm (наследует Form)
Форма второго шага оформления заказа (email и телефон).

Поля:
`_emailInput: HTMLInputElement | null` - поле email
`_phoneInput: HTMLInputElement | null` - поле телефона

Сеттеры:
`set email(value: string)` - устанавливает email
`set phone(value: string)` - устанавливает телефон

Геттеры:
`get email(): string` - получает email
`get phone(): string` - получает телефон

События:
`contacts:submit` - отправка формы (оплата)

#### Класс Success
Компонент сообщения об успешной оплате.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает контейнер

Поля:
`_message: HTMLElement | null` - элемент с сообщением
`_button: HTMLButtonElement | null` - кнопка закрытия

Сеттеры:
`set total(value: number)` - устанавливает сумму в сообщении

События:
`success:close` - закрытие сообщения

## События в приложении

### События моделей данных
| Событие | Описание | Данные |
|---------|----------|--------|
| `catalog:changed` | Изменение каталога товаров | `{ items: IProduct[] }` |
| `basket:changed` | Изменение корзины | `{ items: IProduct[] }` |
| `counter:changed` | Изменение счетчика корзины | `{ count: number }` |
| `buyer:changed` | Изменение поля покупателя | `{ field: string, value: string }` |
| `buyer:any-change` | Любое изменение данных покупателя | `IBuyer` |
| `buyer:validation-error` | Ошибка валидации | `{ field: string, message: string }` |
| `loading:changed` | Изменение состояния загрузки | `{ loading: boolean }` |

### События представлений
| Событие | Описание | Данные |
|---------|----------|--------|
| `card:select` | Выбор карточки товара | `{ id: string }` |
| `card:action` | Клик по кнопке карточки | `{ id: string }` |
| `basket:remove` | Удаление из корзины | `{ id: string }` |
| `page:basket-open` | Открытие корзины | - |
| `basket:order` | Оформление заказа | - |
| `order:payment-change` | Изменение способа оплаты | `{ payment: TPayment }` |
| `order:change` | Изменение поля в форме заказа | `{ field: string, value: string }` |
| `order:submit` | Отправка формы заказа | - |
| `contacts:change` | Изменение поля в форме контактов | `{ field: string, value: string }` |
| `contacts:submit` | Отправка формы контактов | - |
| `success:close` | Закрытие сообщения об успехе | - |
| `modal:open` | Открытие модального окна | - |
| `modal:close` | Закрытие модального окна | - |

## Презентер (main.ts)

Презентер реализован в файле `src/main.ts` и выполняет следующие задачи:

1. Инициализация всех компонентов и моделей
2. Подписка на события от моделей данных и представлений
3. Обработка событий и координация работы модели и представления
4. Загрузка начальных данных с сервера

### Основные функции презентера:

- Загружает каталог товаров при запуске приложения
- При изменении каталога перерисовывает галерею на главной странице
- При изменении корзины обновляет счетчик и список товаров
- Обрабатывает открытие/закрытие модальных окон
- Управляет валидацией форм и активацией кнопок
- Отправляет данные заказа на сервер
- Очищает корзину и данные покупателя после успешной оплаты