import * as PIXI from 'pixi.js';
import {app, resources, sceneGameField} from './app';

export class SceneFlags {

    mainContainer: PIXI.Container;
    textFlagNum: PIXI.Text;

    constructor() {

        // создаем главный контейнер
        this.mainContainer = new PIXI.Container();
        this.mainContainer.x = 20;
        this.mainContainer.y = 20;
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // добавляем иконку с флагом рядом с количеством
        const flagSprite = new PIXI.Sprite(resources.flag.texture);
        this.mainContainer.addChild(flagSprite);

        // стиль числа флага
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 35,
            fontWeight: 'bold',
            fill: ['#cccccc', '#999999'],
            stroke: '#333333',
            strokeThickness: 5
        });

        // устанавливаем позиционируем счетчик оставшихся флагов
        this.textFlagNum = new PIXI.Text(sceneGameField.bombNum.toString(), textStyle);
        this.textFlagNum.x = 45;
        this.textFlagNum.y = 3;

        this.mainContainer.addChild(this.textFlagNum);

    }

    // метод меняет оставшееся количество флагов
    change(num: number) {
        this.textFlagNum.text = num.toString();
    }

    // метод переключает видимость всей сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

}