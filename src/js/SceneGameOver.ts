import * as PIXI from 'pixi.js';
import {app, resources, sceneGameField, sceneMenu, sceneFlags, sceneTimer, sceneMainMenu} from './app';

export class SceneGameOver {

    mainContainer: PIXI.Container;
    windowContainer: PIXI.Container;
    textTitle: PIXI.Text;

    constructor() {

        // создаем главный контейнер - обертку
        this.mainContainer = new PIXI.Container();
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // затемнение
        const blackout = new PIXI.Graphics();
        blackout.beginFill(0x000000, 0.6);
        blackout.drawRect(0, 0, app.screen.width, app.screen.height);
        blackout.endFill();
        this.mainContainer.addChild(blackout);

        // создаем контейнер окна, куда положим все его содержимое
        this.windowContainer = new PIXI.Container();

        // создаем фон окна
        const windowBg = new PIXI.Graphics();
        windowBg.lineStyle(2, 0x111111, 1);
        windowBg.beginFill(0x555555);
        windowBg.drawRect(0, 0, 250, 150);
        windowBg.endFill();

        // и закидываем его в контейнер
        this.windowContainer.addChild(windowBg);

        // задаем размеры контейнеру окна, после того как содержимым обозначили его габариты
        // это необходимо для дальнейшего позиционирования внутренних элементов, относительно этого контейнера
        this.windowContainer.width = this.windowContainer.getBounds().width;
        this.windowContainer.height = this.windowContainer.getBounds().height;

        // позиционируем его посередине
        this.windowContainer.x = app.screen.width / 2 - 125;
        this.windowContainer.y = app.screen.height / 2 - 75;

        // кнопка "закрыть окно"
        const closeSprite = new PIXI.Sprite(resources.close.texture);
        closeSprite.x = this.windowContainer.width - 40;
        closeSprite.y = 6;
        closeSprite.interactive = true;
        closeSprite.buttonMode = true;
        closeSprite.on('click', function() {
            sceneGameField.active(true);
            sceneMenu.active(true);
            this.visible(false);
        }, this);
        this.windowContainer.addChild(closeSprite);

        // кнопка "начать игру заново"
        const restartSprite = new PIXI.Sprite(resources.restartSmall.texture);
        restartSprite.x = this.windowContainer.width / 2 - restartSprite.getBounds().width - 10;
        restartSprite.y = 70;
        restartSprite.interactive = true;
        restartSprite.buttonMode = true;
        restartSprite.on('click', function () {

            sceneGameField.active(true);
            sceneMenu.active(true);
            this.visible(false);

            sceneGameField.restart();
            sceneTimer.reset();

        }, this);

        this.windowContainer.addChild(restartSprite);

        // кнопка "выйти в главное меню"
        const homeSprite = new PIXI.Sprite(resources.homeSmall.texture);
        homeSprite.x = this.windowContainer.width / 2 + 10;
        homeSprite.y = 70;
        homeSprite.interactive = true;
        homeSprite.buttonMode = true;
        homeSprite.on('click', function () {

            sceneGameField.active(true);
            sceneMenu.active(true);
            this.visible(false);

            sceneGameField.restart();
            sceneTimer.reset();

            sceneGameField.visible(false);
            sceneMenu.visible(false);
            sceneFlags.visible(false);
            sceneTimer.visible(false);

            sceneMainMenu.visible(true);

        }, this);

        this.windowContainer.addChild(homeSprite);

        // заголовок окна
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'bold',
            fill: ['#cccccc', '#999999'],
            stroke: '#333333',
            strokeThickness: 5
        });

        this.textTitle = new PIXI.Text('', textStyle);
        this.textTitle.y = 30;
        this.windowContainer.addChild(this.textTitle);

        this.mainContainer.addChild(this.windowContainer);

    }

    // метод устанавливает заголовок окна и выравнивает его посередине относительно габаритов этого заголовка
    set(title: string) {
        sceneGameField.active(false);
        sceneMenu.active(false);
        this.textTitle.text = title;
        this.textTitle.x = this.windowContainer.width / 2 - this.textTitle.getBounds().width / 2;
        this.visible(true);
    }

    // метод переключает видимость сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

}