import * as PIXI from 'pixi.js';
import {app, resources, sceneGameField, sceneMenu, sceneFlags, sceneTimer} from './app';

export class SceneMainMenu {

    mainContainer: PIXI.Container;

    constructor() {

        // создаем главный контейнер
        this.mainContainer = new PIXI.Container();
        //this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // стиль заголовка
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 80,
            fontWeight: 'bold',
            fill: ['#cccccc', '#999999'],
            stroke: '#1e1e1e',
            strokeThickness: 10,
            letterSpacing: 10
        });

        // заголовок
        const textGameName = new PIXI.Text('САПЁР', textStyle);
        textGameName.y = 60;
        this.mainContainer.addChild(textGameName);

        // кнопка "играть"
        const playSprite = new PIXI.Sprite(resources.play.texture);
        playSprite.x = this.mainContainer.getBounds().width / 2 - playSprite.width / 2;
        playSprite.y = 195;
        playSprite.interactive = true;
        playSprite.buttonMode = true;
        playSprite.on('click', function () {

            this.visible(false);
            sceneGameField.visible(true);
            sceneMenu.visible(true);
            sceneFlags.visible(true);
            sceneTimer.visible(true);

        }, this);

        this.mainContainer.addChild(playSprite);

        // картинка "управление в игре"
        const controlSprite = new PIXI.Sprite(resources.control.texture);
        controlSprite.x = this.mainContainer.getBounds().width / 2 - controlSprite.width / 2;
        controlSprite.y = 350;
        this.mainContainer.addChild(controlSprite);

        this.mainContainer.x = app.screen.width / 2 - this.mainContainer.getBounds().width / 2;

    }

    // метод переключает видимость сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

}