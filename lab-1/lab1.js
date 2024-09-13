class Duck {
    constructor(name) {
        this.DuckName = name;
        this.DuckQuack = null;
        this.DuckFly = null;
    }

    quack() {
        if (this.DuckQuack) {
            this.DuckQuack.quack();
        } else {
            console.log("Я не умею крякать :(");
        }
    }

    fly() {
        if (this.DuckFly) {
            this.DuckFly.fly();
        } else {
            console.log("Я не умею летать :(");
        }
    }
}

// Крякание
class quackGromko {
    quack() {
        console.log("Я крякаю громко!");
    }
}

class quackDolgo {
    quack() {
        console.log("Я крякаю долго!");
        
    }
}

class quackRedko {
    quack() {
        console.log("Я крякаю редко!");
        
    }
}

// Полёт
class flyKrylya {
    fly() {
        console.log("Я летаю на крыльях");
        
    }
}

class flyRaketa {
    fly() {
        console.log("Я летаю на ракете");
        
    }
}

class flyRadioupravleniye {
    fly() {
        console.log("Я летаю на радиоуправлении");
        
    }
}


// Утка резиновая
const DuckRezinovaya = new Duck("Резиновая утка");
DuckRezinovaya.DuckQuack = new quackGromko;
DuckRezinovaya.DuckFly = new flyRaketa;

console.log(DuckRezinovaya.DuckName);
DuckRezinovaya.quack();
DuckRezinovaya.fly();

console.log();

// Утка приманка
const DuckPrimanka = new Duck("Утка приманка");
DuckPrimanka.DuckQuack = new quackDolgo;
DuckPrimanka.DuckFly = new flyRadioupravleniye;

console.log(DuckPrimanka.DuckName);
DuckPrimanka.quack();
DuckPrimanka;

console.log();

// Утка красноголовая
const DuckKrasnogolovaya = new Duck("Красноголовая утка");
DuckKrasnogolovaya.DuckQuack = new quackRedko;
DuckPrimanka.DuckFly = new flyKrylya;

console.log(DuckKrasnogolovaya.DuckName);
DuckKrasnogolovaya.quack();
DuckKrasnogolovaya.fly();

console.log();

// Утка саксонская
const DuckSaksonskaya = new Duck("Саксонская утка");
DuckSaksonskaya.DuckQuack = new quackGromko;
DuckSaksonskaya.DuckFly = new flyRaketa;

console.log(DuckSaksonskaya.DuckName);
DuckSaksonskaya.quack();
DuckSaksonskaya.fly();

console.log();

// Утка альбинос
const DuckAlbinos = new Duck("Утка альбинос");
DuckAlbinos.DuckQuack = new quackDolgo;
DuckAlbinos.DuckFly = new flyRadioupravleniye;

console.log(DuckAlbinos.DuckName);
DuckAlbinos.quack();
DuckAlbinos.fly();
