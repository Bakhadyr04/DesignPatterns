const readline = require('readline');

// Напитки и их стоимость
const beverages = {
    1: { name: 'Кофе', cost: 2.00, requiresHeat: true },
    2: { name: 'Лимонад', cost: 1.80, requiresHeat: false },
    3: { name: 'Шоколадный коктейль', cost: 2.50, requiresHeat: false }
};

// Добавки и их стоимость
const addons = {
    1: { name: 'с моккой', cost: 0.20 },
    2: { name: 'с соевым молоком', cost: 0.15 },
    3: { name: 'с карамелью', cost: 0.25 },
    4: { name: 'со льдом', cost: 0.30 },
    0: { name: 'без добавок', cost: 0 }
};

// Объём и их доплата
const volumes = {
    0.4: 0.50,
    0.6: 1.00,
    0.8: 1.50
};

// Выпечка (дополнительные элементы) и их стоимость
const extras = {
    1: { name: 'Круассан', cost: 1.20 },
    2: { name: 'Пирожок', cost: 1.00 },
    3: { name: 'Штрудель', cost: 1.50 },
    0: { name: 'Без дополнительного элемента', cost: 0 }
};

// Методы оплаты
const paymentMethods = {
    1: 'Карта',
    2: 'Наличные',
    3: 'QR-код'
};

// Создание интерфейса
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Шаблонный метод для обработки заказа
class CoffeeOrder {
    beverage;
    addons;
    volume;
    extra;

    constructor(beverage) {
        this.beverage = beverage;
        this.addons = [];
    }

    addAddon(addon) {
        this.addons.push(addon);
    }

    setVolume(volume) {
        this.volume = volume;
    }

    setExtra(extra) {
        this.extra = extra;
    }

    // Метод для подготовки и обработки заказа
    prepareOrder(callback) {
        console.log("Готовим ваш напиток...");
        this.heatWater();
        this.addIngredients();
        this.serve();
        this.processPayment(callback);
    }

    heatWater() {
        if (this.beverage.requiresHeat) {
            console.log("Нагрев воды...");
        } else {
            console.log("Готовим холодный напиток...");
        }
    }

    addIngredients() {
        console.log(`Добавляем ингредиенты: ${this.beverage.name} ${this.addons.map(a => a.name).join(', ')}`);
    }

    serve() {
        console.log(`Ваш напиток налит в стакан объёмом ${this.volume} литра.`);
    }

    processPayment(callback) {
        rl.question("Выберите метод оплаты (1: Карта, 2: Наличные, 3: QR-код): ", (answer) => {
            const paymentMethod = paymentMethods[parseInt(answer)] || paymentMethods[1];
            console.log(`Вы оплатили заказ с помощью: ${paymentMethod}`);
            callback();
        });
    }
}

// Функция выбора напитка
function chooseBeverage(callback) {
    rl.question("Выберите напиток (1: Кофе, 2: Лимонад, 3: Шоколадный коктейль): ", (answer) => {
        const beverage = beverages[parseInt(answer)] || beverages[1]; // По умолчанию выбирается Кофе
        callback(new CoffeeOrder(beverage));
    });
}

// Функция выбора добавок
function chooseAddons(order, callback) {
    rl.question("Выберите добавки (1: Мокка, 2: Соевое молоко, 3: Карамель, 4: Лёд, 0: Без добавок): ", (answer) => {
        const addon = addons[parseInt(answer)] || addons[0]; // По умолчанию без добавок
        if (addon.cost !== 0) {
            order.addAddon(addon);
        }
        callback(order);
    });
}

// Функция выбора объёма
function chooseVolume(order, callback) {
    rl.question("Выберите объём (0.4, 0.6, 0.8): ", (answer) => {
        const volume = parseFloat(answer);
        const volumeCost = volumes[volume] || volumes[0.4]; // По умолчанию 0.4л
        order.setVolume(volume);
        order.beverage.cost += volumeCost;
        callback(order);
    });
}

// Функция выбора дополнительного элемента
function chooseExtra(order, callback) {
    rl.question("Выберите дополнительный элемент (1: Круассан, 2: Пирожок, 3: Штрудель, 0: Ничего): ", (answer) => {
        const extra = extras[parseInt(answer)] || extras[0]; // По умолчанию ничего
        order.setExtra(extra);
        order.beverage.cost += extra.cost;
        callback(order);
    });
}

// Основной процесс заказа
chooseBeverage((order) => {
    chooseAddons(order, (updatedOrder) => {
        chooseVolume(updatedOrder, (orderWithVolume) => {
            chooseExtra(orderWithVolume, (finalOrder) => {
                finalOrder.prepareOrder(() => {
                    console.log(`Ваш заказ: ${finalOrder.beverage.name}, общая стоимость: ${finalOrder.beverage.cost.toFixed(2)} $`);
                    rl.close();
                });
            });
        });
    });
});
