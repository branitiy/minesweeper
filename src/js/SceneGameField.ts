import * as PIXI from 'pixi.js';
import {app, resources, sceneFlags, sceneTimer, sceneGameOver} from './app';

export class SceneGameField {

    mainContainer: PIXI.Container;

    tileSize: number = 50; // ширина и высота ячейки
    tileRowNum: number = 9; // количество ячеек по горизонтали и вертикали
    bombNum: number = 10; // количество бомб
    tiles: any = []; // массив содержащий все ячейки с их параметрами и ссылками на внутренние элементы

    arrEmptyCells: number[]; // глобальный массив пустых ячеек
    isFieldLaunched: boolean = false; // первый клик по полю
    isGameOver: boolean = false; // состояние завершенности игры
    openCellsNum: number = 0; // количество открытых пустых ячеек
    flagsUsedNum: number = 0; // количество использованных флагов

    constructor() {

        // главный контейнер игрового поля
        this.mainContainer = new PIXI.Container();
        this.mainContainer.x = app.screen.width / 2 - 225;
        this.mainContainer.y = 90;
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // стиль цифр в каждой ячейке
        const textbombNumStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'bold',
            fill: ['#cccccc', '#999999'],
            stroke: '#333333',
            strokeThickness: 5
        });

        // получаем количество всех ячеек
        const tileNum = this.tileRowNum * this.tileRowNum;

        // создаем ячейки
        for (let i = 0; i < tileNum; i++) {

            // создаем контейнер для каждой ячейки
            const tileContainer = new PIXI.Container();
            tileContainer.x = (i % this.tileRowNum) * this.tileSize;
            tileContainer.y = Math.floor(i / this.tileRowNum) * this.tileSize;
            tileContainer.interactive = true;

            // вешаем обработчик на событие клика левой кнопки мыши
            tileContainer.on('click', this.cellClickHandler, this);

            // а также на правую
            tileContainer.on('rightclick', this.cellRightClickHandler, this);

            // наполняем контейнер каждой ячейки содержимым, с которым в последствии будем работать (показывать, скрывать и тд)

            // плитка
            const tileSprite = new PIXI.Sprite(resources.tile.texture);
            tileContainer.addChild(tileSprite);

            // бомба
            const bombSprite = new PIXI.Sprite(resources.bomb.texture);
            bombSprite.visible = false;
            tileContainer.addChild(bombSprite);

            // не бомба
            const noBombSprite = new PIXI.Sprite(resources.noBomb.texture);
            noBombSprite.visible = false;
            tileContainer.addChild(noBombSprite);

            // взрыв
            const explosionSprite = new PIXI.Sprite(resources.explosion.texture);
            explosionSprite.visible = false;
            tileContainer.addChild(explosionSprite);

            // количество бомб
            const textBombNum = new PIXI.Text('', textbombNumStyle);
            textBombNum.x = 16;
            textBombNum.y = 10;
            textBombNum.visible = false;
            tileContainer.addChild(textBombNum);

            // крышка
            const capSprite = new PIXI.Sprite(resources.cap.texture);
            //capSprite.alpha = 0.8;
            tileContainer.addChild(capSprite);

            // флаг
            const flagSprite = new PIXI.Sprite(resources.flag.texture);
            flagSprite.visible = false;
            tileContainer.addChild(flagSprite);

            // помещаем контейнер ячейки с ее содержимым в главный контейнер
            this.mainContainer.addChild(tileContainer);

            // формируем массив где будут хранится ячейки с их параметрами и содержимым
            this.tiles[i] = {
                container: tileContainer,
                sprite: {
                    bomb: bombSprite,
                    noBomb: noBombSprite,
                    explosion: explosionSprite,
                    cap: capSprite,
                    flag: flagSprite
                },
                text: {
                    bombNum: textBombNum
                },
                bombBeside: 0,
                bomb: false,
                flag: false,
                open: false
            };
        }
    }

    // обработчик клика по правой кнопке мышки
    cellRightClickHandler(e: any) {

        if(this.isGameOver) return;

        // получаем индекс текущей ячейки
        const tileIndex = e.target.parent.getChildIndex(e.target);

        //console.log("current: " + tileIndex);

        // удаляем флаг если он уже установлен
        if(this.tiles[tileIndex].flag) {
            this.tiles[tileIndex].sprite.flag.visible = false;
            this.tiles[tileIndex].flag = false;
            this.flagsUsedNum--;
            sceneFlags.change(this.bombNum - this.flagsUsedNum);

            // иначе, устанавливаем его
        } else {
            // если количество флагов не превысило максимально допустимое
            // и та ячейка на которую ставим флаг еще не открыта
            if(this.flagsUsedNum < this.bombNum && !this.tiles[tileIndex].open) {
                this.tiles[tileIndex].sprite.flag.visible = true;
                this.tiles[tileIndex].flag = true;
                this.flagsUsedNum++;
                sceneFlags.change(this.bombNum - this.flagsUsedNum);
            }
        }

    }

    // обработчик клика по левой кнопке мышки
    cellClickHandler(e: any) {

        if(this.isGameOver) return;

        // получаем индекс текущей ячейки
        const tileIndex = e.target.parent.getChildIndex(e.target);

        //console.log("current: " + tileIndex);

        // если на ячейке не стоит флаг и она закрыта
        if(!this.tiles[tileIndex].flag && !this.tiles[tileIndex].open) {

            // если был первый клик по полю
            if(!this.isFieldLaunched) {
                // устанавливаем бомбы и числа на соседствующих с ними ячейках
                this.setRandomBombs(this.bombNum, this.tiles.length, tileIndex);
                this.setNumNeighboringBombs();
                // отмечаем что игра стартовала
                this.isFieldLaunched = true;
                // и запускаем таймер
                sceneTimer.start();
            }

            // если ячейка с бомбой
            if(this.tiles[tileIndex].bomb) {

                // завершаем игру поражением
                this.gameLost(tileIndex);

                // иначе если ячейка пустая
            } else if(!this.tiles[tileIndex].bombBeside) {
                // открываем текущую ячейку
                this.openСell(tileIndex);
                // открываем все соседствующие пустые ячейки с прилигающими к ним ячейками с номерами
                // сбрасываем глобальный массив пустых ячеек
                this.arrEmptyCells = [];
                // устанавливаем начальную пустую ячейку, от которой пойдет поиск соседних
                this.arrEmptyCells[0] = tileIndex;
                // и запускаем метод поиска соседних пустых ячеек
                this.searchEmptyNeighboringCells();

                // иначе это ячейка с цифрой
            } else {
                // открываем текущую ячейку
                this.openСell(tileIndex);
            }

        }

        // если все ячейки, на которых нет бомб открыты и на предыдущем шаге игра не завершилась, сообщаем о победе
        if(this.tiles.length - this.bombNum == this.openCellsNum && !this.isGameOver) {
            this.gameWin();
        }

    }

    // метод выводит окно о победе и устанавливает соответствующее состояние
    gameWin() {

        this.isGameOver = true;
        sceneTimer.stop();
        sceneGameOver.set('ПОБЕДА!');

    }

    // метод выводит окно о поражении и устанавливает соответствующее состояние
    gameLost(tileIndex: number) {

        this.isGameOver = true;

        // переключаем состояние бомбы в текущей ячейке на взорванную
        this.tiles[tileIndex].sprite.bomb.visible = false;
        this.tiles[tileIndex].sprite.explosion.visible = true;

        for(let i = 0; i < this.tiles.length; i++) {

            // открываем все бомбы которые не угаданы
            if(this.tiles[i].bomb && !this.tiles[i].flag) {
                this.openСell(i);
            }

            // если есть флаг а бомбы нет, перечеркиваем ячейку
            if(this.tiles[i].flag && !this.tiles[i].bomb) {
                this.tiles[i].text.bombNum.visible = false;
                this.tiles[i].sprite.flag.visible = false;
                this.tiles[i].sprite.noBomb.visible = true;
                this.openСell(i);
            }

        }

        sceneTimer.stop();
        sceneGameOver.set('ПОРАЖЕНИЕ!');

    }

    // метод рандомно устанавливает бомбы на поле
    setRandomBombs(num: number, numberTiles: number, tileIndex: number) {

        const trn = this.tileRowNum;

        // создаем и наполняем массив, с помощью которого будем формировать рандомное расположение бомб
        let numberArray = [];

        for(let i = 0; i < numberTiles; i++) {
            numberArray[i] = i;
        }

        // получаем массив с расположением соседних ячеек
        const offsets = this.getNeighboringCells(tileIndex, trn);

        // добавляем туда текущий индекс (плитка по которой кликнули)
        offsets.push(tileIndex);

        // перебираем соседние ячейки вместе с текущей, с целью исключить их из рандомной выборки
        for(let j = 0; j < offsets.length; j++) {

            // проверяем не вышли ли мы за пределы поля/массива
            if (typeof this.tiles[offsets[j]] !== 'undefined') {

                // если находимся на границе левой стороны поля, то за ее пределами не смотрим
                if(!(tileIndex % trn)) {
                    if(j <= 2) {
                        continue;
                    }
                }

                // тоже самое и с правой стороной
                if(tileIndex % trn == trn - 1) {
                    if(j >= 4 && j <= 6) {
                        continue;
                    }
                }

                // выдергиваем элемент из массива с соответствующим значением
                numberArray.splice(numberArray.indexOf(offsets[j]),1);

            }
        }

        // теперь, при каждой итерации выдергиваем одно рандомное значение
        // и устанавливаем необходимое количество бомб
        for(let i = 0; i < num; i++) {

            // получаем рандомное число в заданных пределах
            const randNum = Math.floor(Math.random() * Math.floor(numberArray.length - 1));

            // открываем бомбу в соответствующей ячейке и помечаем ее
            this.tiles[numberArray[randNum]].sprite.bomb.visible = true;
            this.tiles[numberArray[randNum]].bomb = true;

            // выдергиваем индекс из массива соответствующий этому числу
            numberArray.splice(randNum,1);

        }

    }

    // метод рекурсивно ищет и открывает пустые рядом стоящие ячейки
    searchEmptyNeighboringCells() {

        const trn = this.tileRowNum;
        const locArrEmptyCells = [];

        // перебираем пустые ячейки в глобальном массиве чтобы найти новые соседствующие
        for(let i = 0; i < this.arrEmptyCells.length; i++) {

            // получаем массив с расположением соседних ячеек
            const offsets = this.getNeighboringCells(this.arrEmptyCells[i], trn);

            // перебираем соседние ячейки с целью обнаружения пустых
            for(let j = 0; j < offsets.length; j++) {

                // проверяем не вышли ли мы за пределы поля/массива, а также не стоит ли флаг и закрыта ли ячейка
                if (typeof this.tiles[offsets[j]] !== 'undefined' && !this.tiles[offsets[j]].flag && !this.tiles[offsets[j]].open) {

                    // если находимся на границе левой стороны, то за ее пределами не смотрим
                    if(!(this.arrEmptyCells[i] % trn)) {
                        if(j <= 2) {
                            continue;
                        }
                    }

                    // тоже самое и с правой стороной
                    if(this.arrEmptyCells[i] % trn == trn - 1) {
                        if(j >= 4 && j <= 6) {
                            continue;
                        }
                    }

                    // если, текущая ячейка не соседствует с бомбой и бомба не находится на соседней
                    if(!this.tiles[this.arrEmptyCells[i]].bombBeside && !this.tiles[offsets[j]].bomb) {

                        // если ячейка не содержится ни в глобальном, ни в локальном массиве
                        if(this.arrEmptyCells.indexOf(offsets[j]) === -1 && locArrEmptyCells.indexOf(offsets[j]) === -1) {

                            // закидываем ее в локальный массив
                            locArrEmptyCells.push(offsets[j]);

                            // и открываем ее
                            this.openСell(offsets[j]);

                        }
                    }
                }
            }
        }

        // если новые пустые ячейки найдены
        if(locArrEmptyCells.length) {

            // сливаем локальный и глобальный массивы
            this.arrEmptyCells = this.arrEmptyCells.concat(locArrEmptyCells.filter(i=>this.arrEmptyCells.indexOf(i)===-1));

            // запускаем заново функцию поиска соседних пустых ячеек
            this.searchEmptyNeighboringCells();

        }

    }

    // метод устанавливает на ячейках количество соседствующих бомб
    setNumNeighboringBombs() {

        const trn = this.tileRowNum;

        // перебираем ячейки, на предмет наличия рядом с каждой из них бомбы
        for(let i = 0; i < this.tiles.length; i++) {

            // получаем массив с расположением соседних ячеек
            const offsets = this.getNeighboringCells(i, trn);

            // перебираем соседние ячейки
            for(let j = 0; j < offsets.length; j++) {

                // проверяем не стоит ли на текущей ячейке бомбы и то, что мы не вышли за пределы поля/массива
                if (!this.tiles[i].bomb && typeof this.tiles[offsets[j]] !== 'undefined') {

                    // если бомба в соседней ячейке обнаружена
                    if (this.tiles[offsets[j]].bomb) {

                        // если находимся на границе левой стороны, то за ее пределами не смотрим
                        if(!(i % trn)) {
                            if(j <= 2) {
                                continue;
                            }
                        }

                        // тоже самое и с правой стороной
                        if(i % trn == trn - 1) {
                            if(j >= 4 && j <= 6) {
                                continue;
                            }
                        }

                        // увеличиваем счетчик количества граничащих бомб в текущей ячейке
                        this.tiles[i].bombBeside++;
                    }
                }
            }
        }

        // обходим поле и устанавливаем количество соседствующих бомб
        for(let i = 0; i < this.tiles.length; i++) {

            // устанавливаем и показываем значение счетчика, только если оно положительное
            if(this.tiles[i].bombBeside) {
                this.tiles[i].text.bombNum.text = this.tiles[i].bombBeside;
                this.tiles[i].text.bombNum.visible = true;
            }

        }

    }

    // метод отдает шаблон соседних ячеек
    getNeighboringCells(i: number, trn: number) {

        return [
            i + (trn - 1), i - 1, i - (trn + 1),
            i - trn,
            i - (trn - 1), i + 1, i + (trn + 1),
            i + trn
        ];

    }

    // метод открывает ячейку и подсчитывает количество открытых
    openСell(tileIndex: number) {
        if(this.tiles[tileIndex].open) {
            console.log('ячейка ' + tileIndex + ' уже открыта');
        } else {
            this.tiles[tileIndex].sprite.cap.visible = false;
            this.tiles[tileIndex].open = true;
            this.openCellsNum++;
        }

    }

    // метод обновляет игровое поле
    restart() {

        // перебираем ячейки, с целью сбросить их значение в первоначальное состояние
        for(let i = 0; i < this.tiles.length; i++) {

            this.tiles[i].bombBeside = 0;
            this.tiles[i].bomb = false;
            this.tiles[i].flag = false;
            this.tiles[i].open = false;

            this.tiles[i].text.bombNum.text = '';
            this.tiles[i].text.bombNum.visible = false;

            this.tiles[i].sprite.bomb.visible = false;
            this.tiles[i].sprite.noBomb.visible = false;
            this.tiles[i].sprite.explosion.visible = false;
            this.tiles[i].sprite.cap.visible = true;
            this.tiles[i].sprite.flag.visible = false;

            this.arrEmptyCells = [];
            this.isFieldLaunched = false;
            this.isGameOver = false;
            this.openCellsNum = 0;
            this.flagsUsedNum = 0;

        }

        sceneFlags.change(this.bombNum);
        sceneTimer.reset();

    }

    // метод переключает видимость всей сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

    // метод отключает или включает обработку событий кликов по плиткам
    active(state: boolean) {

        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].container.interactive = state;
        }

    }

}