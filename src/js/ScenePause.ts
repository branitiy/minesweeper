import * as PIXI from 'pixi.js';
import {app, resources, sceneGameField, sceneMenu, sceneFlags, sceneTimer, sceneMainMenu} from './app';

export class ScenePause {

    mainContainer: PIXI.Container;

    constructor() {

        // создаем главный контейнер
        this.mainContainer = new PIXI.Container();
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // кнопка "вернуться"
        const backSprite = new PIXI.Sprite(resources.back.texture);
        backSprite.interactive = true;
        backSprite.buttonMode = true;
        backSprite.on('click', function () {

            this.visible(false);
            sceneGameField.visible(true);
            sceneMenu.visible(true);
            sceneFlags.visible(true);
            sceneTimer.visible(true);
            sceneTimer.resume();

        }, this);

        this.mainContainer.addChild(backSprite);

        // кнопка "начать игру заново"
        const restartSprite = new PIXI.Sprite(resources.restart.texture);
        restartSprite.y = 120;
        restartSprite.interactive = true;
        restartSprite.buttonMode = true;

        restartSprite.on('click', function () {

            sceneGameField.restart();
            sceneTimer.reset();

            this.visible(false);
            sceneGameField.visible(true);
            sceneMenu.visible(true);
            sceneFlags.visible(true);
            sceneTimer.visible(true);

        }, this);

        this.mainContainer.addChild(restartSprite);

        // кнопка "выйти в главное меню"
        const homeSprite = new PIXI.Sprite(resources.home.texture);
        homeSprite.y = 240;
        homeSprite.interactive = true;
        homeSprite.buttonMode = true;

        homeSprite.on('click', function () {

            sceneGameField.restart();
            sceneTimer.reset();

            this.visible(false);
            sceneMainMenu.visible(true);

        }, this);

        this.mainContainer.addChild(homeSprite);

        this.mainContainer.x = app.screen.width / 2 - this.mainContainer.getBounds().width / 2;
        this.mainContainer.y = app.screen.height / 2 - this.mainContainer.getBounds().height / 2;

    }

    // метод переключает видимость сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

}