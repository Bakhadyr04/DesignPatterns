const readline = require('readline');

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
        this.state.dispense();
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

// Функция для запроса у пользователя действий
function promptUser() {
    console.log("\nВыберите действие:");
    console.log("1. Вставить монету");
    console.log("2. Повернуть рычаг");
    console.log("3. Пополнить автомат");
    console.log("4. Проверить количество жвачек");
    console.log("0. Выйти");

    rl.question("Введите ваш выбор: ", (choice) => {
        switch (choice) {
            case '1':
                gumballMachine.insertCoin();
                break;
            case '2':
                gumballMachine.turnLever();
                break;
            case '3':
                rl.question("Введите количество жвачек для пополнения: ", (count) => {
                    gumballMachine.refill(parseInt(count, 10));
                    promptUser();
                });
                return; // Повторяем запрос после пополнения
            case '4':
                console.log(`Осталось жвачек: ${gumballMachine.getCount()}`);
                break;
            case '0':
                rl.close();
                console.log("Выход из программы.");
                return;
            default:
                console.log("Неверный выбор, попробуйте снова.");
        }
        promptUser(); // Повторяем запрос после каждого действия
    });
}

// Запуск взаимодействия с пользователем
promptUser();
