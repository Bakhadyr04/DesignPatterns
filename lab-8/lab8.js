const readline = require('readline');

// 1: Итератор для работы с меню
class MenuIterator {
    constructor(menu) {
        this.menu = menu;
        this.index = 0;   // Инициализируем индекс для итерации
    }

    // Возвращаем текущий элемент и двигаем индекс дальше, если есть элементы
    next() {
        return this.index < this.menu.length ?
            { value: this.menu[this.index++], done: false } :
            { done: true };
    }

    // Проверяем, есть ли ещё элементы для итерации
    hasNext() {
        return this.index < this.menu.length;
    }


    remove() {
        if (this.index > 0) {
            this.menu.splice(this.index - 1, 1);
            this.index--;
        }
    }
}

// 2: Интерфейс для меню
class MenuComponent {
    constructor(name, price = 0) {
        this.name = name;
        this.price = price;
    }

    // Методы ниже являются заглушками, которые будут переопределены в подклассах
    add(component) {
        throw new Error("Unsupported operation");
    }

    remove(component) {
        throw new Error("Unsupported operation");
    }

    getChildren() {
        throw new Error("Unsupported operation");
    }

    display(depth = 0) {
        throw new Error("Unsupported operation");
    }
}

// 3: Классы для конкретных меню и подменю
class MenuItem extends MenuComponent {
    constructor(name, price) {
        super(name, price);
    }

    display(depth = 0) {
        console.log('-'.repeat(depth) + this.name + ` (${this.price.toFixed(2)} $)`);
    }
}

class MenuComposite extends MenuComponent {
    constructor(name) {
        super(name);
        this.children = [];
    }

    add(component) {
        this.children.push(component);
    }

    remove(component) {
        this.children = this.children.filter(child => child !== component);
    }

    getChildren() {
        return this.children;
    }

    display(depth = 0) {
        console.log('--' + this.name);
        for (const child of this.children) {
            child.display(depth + 1);
        }
    }
}

// 4: Инициализация меню
const pizzeriaMenu = new MenuComposite("Меню Пиццерии");
pizzeriaMenu.add(new MenuItem("Пепперони", 8.00));
pizzeriaMenu.add(new MenuItem("Маргарита", 7.50));

const coffeeShopMenu = new MenuComposite("Меню Кофейни");
coffeeShopMenu.add(new MenuItem("Кофе", 3.00));
coffeeShopMenu.add(new MenuItem("Чай", 2.50));

const dessertMenu = new MenuComposite("Десертное меню");
dessertMenu.add(new MenuItem("Торт", 4.00));
dessertMenu.add(new MenuItem("Мороженое", 3.50));

const mainMenu = new MenuComposite("Основное меню");
mainMenu.add(pizzeriaMenu);
mainMenu.add(coffeeShopMenu);
mainMenu.add(dessertMenu);

// 5: Создаем интерфейс команд для пользователя
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let totalCost = 0; // Для хранения общей стоимости заказа
let orderItems = []; // Для хранения заказанных блюд

// Функция отображения меню
function displayMenu(menu) {
    let index = 1;
    console.log("\n" + menu.name + ":");
    menu.getChildren().forEach((subMenu) => {
        console.log(`-- ${subMenu.name}`);
        subMenu.getChildren().forEach((item) => {
            console.log(`   ${index}. ${item.name} - ${item.price.toFixed(2)} $`); // Блюда отображаются с цифрами
            index++;
        });
    });
    return index;
}

// Функция отображения выбранных блюд
function displaySelectedItems() {
    console.log("\nВаш текущий заказ:");
    if (orderItems.length === 0) {
        console.log("Вы пока ничего не выбрали.");
    } else {
        orderItems.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} - ${item.price.toFixed(2)} $`);
        });
        console.log(`Общая стоимость: ${totalCost.toFixed(2)} $`);
    }
}

// Основная функция для выбора действий
function chooseAction() {
    displayMenu(mainMenu);

    rl.question("\nВыберите блюдо по номеру или нажмите 0 для завершения заказа: ", (answer) => {
        const choice = parseInt(answer);
        const flatMenu = flattenMenu(mainMenu);
        if (choice === 0) {
            finishOrder();
        } else if (choice > 0 && choice <= flatMenu.length) {
            const selectedItem = flatMenu[choice - 1];
            totalCost += selectedItem.price; // Добавляем стоимость выбранного элемента
            orderItems.push(selectedItem); // Добавляем выбранное блюдо в заказ
            console.log(`\nВы выбрали: ${selectedItem.name} (${selectedItem.price.toFixed(2)} $)`); // Мгновенный вывод выбранного блюда
            displaySelectedItems(); // Отображение текущего заказа
            chooseAction(); // Продолжаем выбор
        } else {
            console.log("Неверный выбор, попробуйте снова.");
            chooseAction();
        }
    });
}

// Функция для получения всех блюд
function flattenMenu(menu) {
    let flatItems = [];
    menu.getChildren().forEach((subMenu) => {
        flatItems = flatItems.concat(subMenu.getChildren());
    });
    return flatItems;
}

// Функция для завершения заказа
function finishOrder() {
    console.log("\nВаш окончательный заказ:");
    orderItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - ${item.price.toFixed(2)} $`);
    });
    console.log(`\nИтоговая стоимость: ${totalCost.toFixed(2)} $`);
    rl.close();
}

// Запуск программы
chooseAction();
