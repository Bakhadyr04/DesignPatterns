const readline = require('readline');

// Описание напитков и их стоимости
const beverages = {
    1: { name: 'Эспрессо', cost: 1.99 },
    2: { name: 'Айс Латте', cost: 0.99 },
    3: { name: 'Раф', cost: 1.05 }
};

// Описание добавок и их стоимости
const addons = {
    1: { name: 'с моккой', cost: 0.20 },
    2: { name: 'с соевым молоком', cost: 0.15 },
    3: { name: 'со взбитыми сливками', cost: 0.10 }
};

// Функция для интерфейса обработки ввода с консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функция для выбора напитка
function chooseBeverage(callback) {
    rl.question("Выберите напиток (1: Эспрессо, 2: Айс Латте, 3: Раф): ", (answer) => {
        const beverage = beverages[answer] || beverages[1]; // По умолчанию выбирается Эспрессо
        callback(beverage);
    });
}

// Функция для выбора добавок
function chooseAddons(beverage, callback) {
    rl.question("Выберите добавки (1: Мокка, 2: Соевое молоко, 3: Взбитые сливки, 0: Без добавок): ", (answer) => {
        const addon = addons[answer];
        if (addon) {
            beverage.name += `, ${addon.name}`;
            beverage.cost += addon.cost;
        }
        callback(beverage);
    });
}

// Основная логика заказа
chooseBeverage((beverage) => {
    chooseAddons(beverage, (finalBeverage) => {
        console.log(`${finalBeverage.name} стоит ${finalBeverage.cost.toFixed(2)} $`);
        rl.close();
    });
});
