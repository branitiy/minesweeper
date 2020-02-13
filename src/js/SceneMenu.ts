import * as PIXI from 'pixi.js';
import {app, resources, sceneGameField, sceneFlags, sceneTimer, scenePause} from './app';

export class SceneMenu {

    mainContainer: PIXI.Container;

    constructor() {

        // создаем главный контейнер
        this.mainContainer = new PIXI.Container();
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // кнопка "пауза"
        const pauseSprite = new PIXI.Sprite(resources.pauseSmall.texture);
        pauseSprite.interactive = true;
        pauseSprite.buttonMode = true;
        pauseSprite.on('click', function () {

            this.visible(false);
            sceneGameField.visible(false);
            sceneFlags.visible(false);

            sceneTimer.pause();
            sceneTimer.visible(false);

            scenePause.visible(true);

        }, this);

        this.mainContainer.addChild(pauseSprite);

        this.mainContainer.x = app.screen.width / 2 - this.mainContainer.getBounds().width / 2;
        this.mainContainer.y = 20;

    }

    // метод переключает видимость сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

    // метод отключает или включает обработку событий кликов по элементам меню
    active(state: boolean) {

        for(let i = 0; i < this.mainContainer.children.length; i++ ) {
            this.mainContainer.children[i].interactive = state;
        }

    }

}