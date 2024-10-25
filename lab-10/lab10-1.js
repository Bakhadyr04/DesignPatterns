const readline = require('readline');
const { CityGumballMachine, GumballMachineProxy } = require('./lab10-2.js');

// Интерфейс состояния
class State {
    // Метод для вставки монеты
    insertCoin() {
        throw new Error("Этот метод должен быть переопределён");
    }

    // Метод для поворота рычага
    turnLever() {
        throw new Error("Этот метод должен быть переопределён");
    }

    // Метод для выдачи жвачки
    dispense() {
        throw new Error("Этот метод должен быть переопределён");
    }
}

// Состояние "Без монеты"
class NoCoinState extends State {
    constructor(gumballMachine) {
        super();
        this.gumballMachine = gumballMachine;
    }

    // Вставка монеты переводит автомат в состояние "Монета вставлена"
    insertCoin() {
        console.log("Монета вставлена.");
        this.gumballMachine.setState(this.gumballMachine.hasCoinState);
    }

    // Без монеты нельзя повернуть рычаг
    turnLever() {
        console.log("Сначала нужно вставить монету.");
    }

    // Без монеты нельзя выдать жвачку
    dispense() {
        console.log("Невозможно выдать жвачку.");
    }
}

// Состояние "Монета вставлена"
class HasCoinState extends State {
    constructor(gumballMachine) {
        super();
        this.gumballMachine = gumballMachine;
    }

    // Нельзя вставить вторую монету, когда уже одна вставлена
    insertCoin() {
        console.log("Монета уже вставлена.");
    }

    // Поворот рычага. Есть шанс выдать два приза или игрушку
    turnLever() {
        console.log("Рычаг повернут.");
        const randomChance = Math.random() * 100;
        if (randomChance <= 10) {
            this.gumballMachine.setState(this.gumballMachine.doublePrizeState);
        } else if (randomChance <= 15) {
            this.gumballMachine.setState(this.gumballMachine.toyPrizeState);
        } else {
            this.gumballMachine.setState(this.gumballMachine.soldState);
        }
    }

    // Сначала нужно повернуть рычаг, чтобы выдать жвачку
    dispense() {
        console.log("Сначала поверните рычаг.");
    }
}

// Состояние "Приз выдан"
class SoldState extends State {
    constructor(gumballMachine) {
        super();
        this.gumballMachine = gumballMachine;
    }

    // Вставка монеты невозможна, так как уже идёт процесс выдачи жвачки
    insertCoin() {
        console.log("Пожалуйста, подождите, выдаётся жвачка.");
    }

    // Поворот рычага невозможен, так как он уже был повернут
    turnLever() {
        console.log("Рычаг уже был повернут.");
    }

    // Выдача одной жвачки
    dispense() {
        this.gumballMachine.releaseBall();
        console.log("Жвачка выдана.");
        if (this.gumballMachine.getCount() > 0) {
            this.gumballMachine.setState(this.gumballMachine.noCoinState);
        } else {
            console.log("Жвачки закончились!");
            this.gumballMachine.setState(this.gumballMachine.soldOutState);
        }
    }
}

// Состояние "Выдать 2 приза"
class DoublePrizeState extends State {
    constructor(gumballMachine) {
        super();
        this.gumballMachine = gumballMachine;
    }

    // Выдача двух жвачек вместо одной
    dispense() {
        this.gumballMachine.releaseBall();
        this.gumballMachine.releaseBall();
        console.log("Выдаём две жвачки!");
        if (this.gumballMachine.getCount() > 0) {
            this.gumballMachine.setState(this.gumballMachine.noCoinState);
        } else {
            console.log("Жвачки закончились!");
            this.gumballMachine.setState(this.gumballMachine.soldOutState);
        }
    }
}

// Состояние "Выдать игрушку вместо жвачки"
class ToyPrizeState extends State {
    constructor(gumballMachine) {
        super();
        this.gumballMachine = gumballMachine;
    }

    // Выдача игрушки вместо жвачки
    dispense() {
        console.log("Выдаём игрушку вместо жвачки!");
        if (this.gumballMachine.getCount() > 0) {
            this.gumballMachine.setState(this.gumballMachine.noCoinState);
        } else {
            console.log("Жвачки закончились!");
            this.gumballMachine.setState(this.gumballMachine.soldOutState);
        }
    }
}

// Основной класс автомата
class GumballMachine {
    constructor(count) {
        this.count = count;
        this.noCoinState = new NoCoinState(this);
        this.hasCoinState = new HasCoinState(this);
        this.soldState = new SoldState(this);
        this.doublePrizeState = new DoublePrizeState(this);
        this.toyPrizeState = new ToyPrizeState(this);
        this.soldOutState = null; // Можно добавить отдельное состояние для автомата, в котором закончились жвачки
        this.state = this.noCoinState; // Начальное состояние
    }

    // Вставить монету
    insertCoin() {
        this.state.insertCoin();
    }

    // Повернуть рычаг
    turnLever() {
        this.state.turnLever();
        this.state.dispense(); // Здесь должен быть вызов dispense
    }

    // Установить новое состояние
    setState(state) {
        this.state = state;
    }

    // Выдача одной жвачки (уменьшение счётчика)
    releaseBall() {
        if (this.count > 0) {
            this.count--;
            console.log("Жвачка выкатится через...");
        }
    }

    // Получить количество оставшихся жвачек
    getCount() {
        return this.count;
    }

    // Заполнить автомат
    refill(count) {
        this.count += count;
        console.log(`Автомат пополнен на ${count} жвачек.`);
        this.setState(this.noCoinState);
    }
}

// Создаем интерфейс для пользователя
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Создаем автомат с 5 жвачками
const gumballMachine = new GumballMachine(5);

// Создаем машины для городов
const cityMachines = {
    "Москва": new CityGumballMachine("Москва"),
    "Санкт-Петербург": new CityGumballMachine("Санкт-Петербург"),
    "Екатеринбург": new CityGumballMachine("Екатеринбург"),
};

// Использование заместителя
const proxyMachines = {
    "Москва": new GumballMachineProxy(cityMachines["Москва"]),
    "Санкт-Петербург": new GumballMachineProxy(cityMachines["Санкт-Петербург"]),
    "Екатеринбург": new GumballMachineProxy(cityMachines["Екатеринбург"]),
};

let currentCity = "Москва"; // Начальный город

// Функция для выбора города
function chooseCity() {
    console.log("\nВыберите город:");
    console.log("1. Москва");
    console.log("2. Санкт-Петербург");
    console.log("3. Екатеринбург");
    
    rl.question("Введите ваш выбор: ", (choice) => {
        switch (choice) {
            case '1':
                currentCity = "Москва";
                break;
            case '2':
                currentCity = "Санкт-Петербург";
                break;
            case '3':
                currentCity = "Екатеринбург";
                break;
            default:
                console.log("Некорректный выбор. Попробуйте снова.");
                return chooseCity();
        }
        console.log(`Вы выбрали город: ${currentCity}`);
        showMenu();
    });
}

// Функция для отображения меню
function showMenu() {
    console.log("\nВыберите действие:");
    console.log("1. Вставить монету");
    console.log("2. Повернуть рычаг");
    console.log("3. Пополнить автомат");
    console.log("4. Получить отчет по продажам");
    console.log("5. Выбрать другой город");
    console.log("0. Выйти");

    rl.question("Введите ваш выбор: ", (choice) => {
        switch (choice) {
            case '1':
                proxyMachines[currentCity].insertCoin();
                showMenu();
                break;
            case '2':
                proxyMachines[currentCity].turnLever();
                showMenu();
                break;
            case '3':
                rl.question("Сколько жвачек добавить? ", (count) => {
                    proxyMachines[currentCity].refill(parseInt(count));
                    showMenu();
                });
                break;
            case '4':
                console.log(proxyMachines[currentCity].getSalesReport());
                showMenu();
                break;
            case '5':
                chooseCity();
                break;
            case '0':
                console.log("Выход из программы.");
                rl.close();
                break;
            default:
                console.log("Некорректный выбор. Попробуйте снова.");
                showMenu();
        }
    });
}

// Запуск программы
chooseCity();
