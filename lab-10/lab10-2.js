class CityGumballMachine {
    constructor(city) {
        this.city = city;
        this.coinsInserted = 0;
        this.gumballsSold = 0;
        this.prizesGiven = 0;
        this.gumballsAvailable = 5; // Начальное количество жвачек
    }

    // Вставка монеты
    insertCoin() {
        this.coinsInserted++;
        console.log(`Монета вставлена в автомат ${this.city}.`);
    }

    // Поворот рычага
    turnLever() {
        if (this.gumballsAvailable > 0) {
            this.gumballsSold++;
            console.log(`Жвачка выдана из автомата в ${this.city}.`);
            this.gumballsAvailable--;
            if (Math.random() < 0.1) {
                this.prizesGiven++;
                console.log(`Выдан приз из автомата в ${this.city}.`);
            }
        } else {
            console.log(`Нет жвачек в автомате ${this.city}.`);
        }
    }

    // Пополнение автомата жвачками
    refill(count) {
        this.gumballsAvailable += count;
        console.log(`Автомат ${this.city} пополнен на ${count} жвачек.`);
    }

    // Получение отчета о продажах
    getSalesReport() {
        return `Отчет по автомату в ${this.city}:\n` +
               `Монет: ${this.coinsInserted}\n` +
               `Жвачек выдано: ${this.gumballsSold}\n` +
               `Призов выдано: ${this.prizesGiven}\n` +
               `Осталось жвачек: ${this.gumballsAvailable}`;
    }
}

// Прокси-автомат
class GumballMachineProxy {
    constructor(cityGumballMachine) {
        this.cityGumballMachine = cityGumballMachine;
    }

    // Вставка монеты
    insertCoin() {
        this.cityGumballMachine.insertCoin();
    }

    // Поворот рычага
    turnLever() {
        this.cityGumballMachine.turnLever();
    }

    // Пополнение автомата жвачками
    refill(count) {
        this.cityGumballMachine.refill(count);
    }

    // Получение отчета о продажах
    getSalesReport() {
        return this.cityGumballMachine.getSalesReport();
    }
}

module.exports = { CityGumballMachine, GumballMachineProxy };