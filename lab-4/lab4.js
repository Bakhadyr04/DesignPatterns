const readline = require('readline');

// Описание напитков и их стоимости
const beverages = {
    coffee: { name: 'Кофе', cost: 2.00 },
    lemonade: { name: 'Лимонад', cost: 1.80 },
    chocolateShake: { name: 'Шоколадный коктейль', cost: 2.50 }
};

// Описание добавок и их стоимости
const addons = {
    mocha: { name: 'с моккой', cost: 0.20 },
    soy: { name: 'с соевым молоком', cost: 0.15 },
    caramel: { name: 'с карамелью', cost: 0.25 },
    ice: { name: 'со льдом', cost: 0.30 }
};

// Описание объёмов и их доплаты
const volumes = {
    0.4: 0.50,
    0.6: 1.00,
    0.8: 1.50
};

// Функция для выбора напитка
function chooseBeverage(callback) {
    rl.question("Выберите напиток (1: Кофе, 2: Лимонад, 3: Шоколадный коктейль): ", (answer) => {
        let beverage;
        switch (answer) {
            case '1':
                beverage = beverages.coffee;
                break;
            case '2':
                beverage = beverages.lemonade;
                break;
            case '3':
                beverage = beverages.chocolateShake;
                break;
            default:
                console.log("Некорректный выбор, выбрано 'Кофе' по умолчанию.");
                beverage = beverages.coffee;
        }
        callback(beverage);
    });
}

// Функция для выбора добавок
function chooseAddons(beverage, callback) {
    rl.question("Выберите добавки (1: Мокка, 2: Соевое молоко, 3: Карамель, 4: Лёд, 0: Без добавок): ", (answer) => {
        switch (answer) {
            case '1':
                beverage.name += `, ${addons.mocha.name}`;
                beverage.cost += addons.mocha.cost;
                break;
            case '2':
                beverage.name += `, ${addons.soy.name}`;
                beverage.cost += addons.soy.cost;
                break;
            case '3':
                beverage.name += `, ${addons.caramel.name}`;
                beverage.cost += addons.caramel.cost;
                break;
            case '4':
                beverage.name += `, ${addons.ice.name}`;
                beverage.cost += addons.ice.cost;
                break;
            case '0':
                break;
            default:
                console.log("Некорректный выбор, добавки не будут выбраны.");
        }
        callback(beverage);
    });
}

// Функция для выбора объёма
function chooseVolume(beverage, callback) {
    rl.question("Выберите объём (0.4, 0.6, 0.8): ", (answer) => {
        const volume = parseFloat(answer);
        if (volumes[volume]) {
            beverage.name += ` (${volume}л)`;
            beverage.cost += volumes[volume];
        } else {
            console.log("Некорректный выбор объёма, выбрано 0.4л по умолчанию.");
            beverage.name += ` (0.4л)`;
            beverage.cost += volumes[0.4];
        }
        callback(beverage);
    });
}

// Основная логика заказа
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

chooseBeverage((beverage) => {
    chooseAddons(beverage, (updatedBeverage) => {
        chooseVolume(updatedBeverage, (finalBeverage) => {
            console.log(`${finalBeverage.name} стоит ${finalBeverage.cost.toFixed(2)} $`);
            rl.close();
        });
    });
});
