import * as PIXI from 'pixi.js';
import {app} from './app';

export class SceneTimer {

    mainContainer: PIXI.Container;
    textTimer: PIXI.Text;
    idInterval: ReturnType<typeof setInterval>;
    timePassed: number = 0;
    isTimerStarted: boolean = false;

    constructor() {

        // создаем главный контейнер
        this.mainContainer = new PIXI.Container();
        this.mainContainer.visible = false;
        app.stage.addChild(this.mainContainer);

        // стиль таймера
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 35,
            fontWeight: 'bold',
            fill: ['#cccccc', '#999999'],
            stroke: '#333333',
            strokeThickness: 5
        });

        // устанавливаем начальное состояние таймера
        this.textTimer = new PIXI.Text('00:00', textStyle);
        this.mainContainer.addChild(this.textTimer);

        this.mainContainer.x = app.screen.width - this.mainContainer.getBounds().width - 20;
        this.mainContainer.y = 23;

    }

    // метод запускает таймер
    start() {

        const self = this;

        this.idInterval = setInterval(function () {

            self.timePassed += 100;

            self.textTimer.text = self.formatTime(self.timePassed).toString();

        }, 100);

        this.isTimerStarted = true;

    }

    // метод останавливает таймер
    stop() {
        clearInterval(this.idInterval);
        this.isTimerStarted = false;
    }

    // метод приостанавливает таймер
    pause() {
        clearInterval(this.idInterval);
    }

    // метод запускает таймер, только если он был приостановлен
    resume() {
        if(this.isTimerStarted) {
            this.start();
        }
    }

    // метод сбрасывает таймер
    reset() {
        clearInterval(this.idInterval);
        this.timePassed = 0;
        this.textTimer.text = '00:00';
        this.isTimerStarted = false;
    }

    // метод формирует из миллисекунд строку времени
    formatTime(timeDifference: number) {

        let seconds = Math.floor(timeDifference / 1000) % 60;
        let minutes = Math.floor(timeDifference / 1000 / 60) % 60;

        let result = (minutes < 10) ? "0" + minutes : + minutes;
        result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        return result;
    }

    // метод переключает видимость сцены
    visible(state: boolean) {
        this.mainContainer.visible = state;
    }

}