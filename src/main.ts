// src/main.ts
import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Commerce } from './components/Commerce/Commerce';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';

async function main() {
    console.log('ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ И API\n');

    //СОЗДАНИЕ ЭКЗЕМПЛЯРОВ
    console.log('СОЗДАНИЕ ЭКЗЕМПЛЯРОВ ВСЕХ КЛАССОВ:');
    
    const catalog = new Catalog();
    const basket = new Basket();
    const buyer = new Buyer();
    const api = new Api('http://localhost:3000/api/weblarek');
    const commerce = new Commerce(api);
    
    console.log('Созданы экземпляры: Catalog, Basket, Buyer, Api, Commerce');

    //ТЕСТИРОВАНИЕ МОДЕЛЕЙ С ЛОКАЛЬНЫМИ ДАННЫМИ
    console.log('\n2. ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ:');
    
    //Тестирование Catalog
    catalog.saveItems(apiProducts.items);
    console.log('Catalog: сохранено товаров:', catalog.getItems().length);
    
    const testProduct = catalog.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390');
    console.log('Catalog: поиск по ID:', testProduct ? 'найден' : 'не найден');
    
    catalog.setSelectedItem(apiProducts.items[0]);
    console.log('Catalog: выбран товар:', catalog.getSelectedItem()?.title);
    
    catalog.clearSelectedItem();
    console.log('Catalog: сброшен выбранный товар:', catalog.getSelectedItem() === null);
    
    //Тестирование Basket
    if (catalog.getItems().length >= 2) {
        basket.add(catalog.getItems()[0]);
        basket.add(catalog.getItems()[1]);
        console.log('Basket: добавлено товаров:', basket.getItemsCount());
        console.log('Basket: общая сумма:', basket.getTotalPrice(), 'руб.');
        
        const itemId = basket.getItems()[0].id;
        console.log('Basket: проверка наличия товара', itemId, ':', basket.hasItem(itemId));
        
        basket.remove(itemId);
        console.log('Basket: после удаления осталось:', basket.getItemsCount(), 'товаров');
        
        basket.clear();
        console.log('Basket: после очистки:', basket.getItemsCount(), 'товаров');
    }
    
    //Тестирование Buyer
    buyer.saveData({
        payment: 'online',
        email: 'test@example.com',
        phone: '+7 (999) 123-45-67',
        address: 'г. Москва, ул. Тестовая, д. 1'
    });
    console.log('Buyer: данные сохранены');
    console.log('Buyer: валидация данных:', buyer.validate() ? 'пройдена' : 'не пройдена');
    
    buyer.clear();
    console.log('Buyer: после очистки валидация:', buyer.validate() ? 'пройдена' : 'не пройдена (ожидаемо)');
    
    //ЗАПРОС К СЕРВЕРУ
    console.log('\nЗАПРОС К СЕРВЕРУ ЗА ТОВАРАМИ:');
    
    try {
        console.log('Выполняем запрос к серверу через Commerce...');
        
        const productsFromServer = await commerce.getProducts();
        
        //Сохраняем полученные данные в модель Catalog
        catalog.saveItems(productsFromServer);
        
        console.log('Получено товаров с сервера:', productsFromServer.length);
        console.log('Сохранено в модели Catalog:', catalog.getItems().length, 'товаров');
        
        //Выводим данные через методы класса
        console.log('\nВывод полученных товаров через методы Catalog:');
        catalog.getItems().slice(0, 3).forEach((product, index) => {
            console.log(`${index + 1}. ${product.title} - ${product.price ?? 'Цена не указана'} руб.`);
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('Не удалось получить данные с сервера:', errorMessage);
        console.log('Используем локальные данные для демонстрации...');
        
        //Используем локальные данные если сервер не доступен
        catalog.saveItems(apiProducts.items);
        console.log('Использованы локальные данные:', catalog.getItems().length, 'товаров');
        
        //Выводим локальные данные
        console.log('\nЛокальные товары:');
        catalog.getItems().slice(0, 3).forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.title} - ${product.price ?? 'Цена не указана'} руб.`);
        });
    }

    //ИТОГОВАЯ ПРОВЕРКА
    console.log('\nИТОГОВАЯ ПРОВЕРКА РАБОТЫ ВСЕХ КОМПОНЕНТОВ:');
    
    console.log('Все классы созданы и протестированы');
    console.log(`Catalog содержит: ${catalog.getItems().length} товаров`);
    console.log(`Basket содержит: ${basket.getItemsCount()} товаров`);
    console.log(`Buyer данные: ${buyer.validate() ? 'заполнены' : 'очищены'}`);
    console.log('Commerce класс протестирован с API');
    
    console.log('\nТЕСТИРОВАНИЕ ЗАВЕРШЕНО\n');
}

//Запускаем приложение
main().catch(console.error);