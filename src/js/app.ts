import * as PIXI from 'pixi.js';
import { SceneMainMenu } from "./SceneMainMenu";
import { ScenePause } from "./ScenePause";
import { SceneGameOver } from "./SceneGameOver";
import { SceneGameField } from "./SceneGameField";
import { SceneMenu } from "./SceneMenu";
import { SceneFlags } from "./SceneFlags";
import { SceneTimer } from "./SceneTimer";

export const app = new PIXI.Application({
    width: 500,
    height: 560,
    backgroundColor: 0x555555
});

document.getElementById('game').appendChild(app.view);

// отключаем появление контекстного меню при нажатии правой кнопки мыши
app.view.oncontextmenu = () => false;

app.loader
    .add('tile', 'assets/images/tile.png')
    .add('bomb', 'assets/images/bomb.png')
    .add('noBomb', 'assets/images/no_bomb.png')
    .add('explosion', 'assets/images/explosion.png')
    .add('cap', 'assets/images/cap.png')
    .add('flag', 'assets/images/flag.png')

    .add('play', 'assets/images/play.png')
    .add('back', 'assets/images/back.png')
    .add('restart', 'assets/images/restart.png')
    .add('home', 'assets/images/home.png')
    .add('restartSmall', 'assets/images/restart_small.png')
    .add('pauseSmall', 'assets/images/pause_small.png')
    .add('homeSmall', 'assets/images/home_small.png')

    .add('control', 'assets/images/control.png')
    .add('close', 'assets/images/close.png')
    .load(setup);

export const resources = app.loader.resources;

export let sceneMainMenu: SceneMainMenu,
    sceneGameField: SceneGameField,
    sceneMenu: SceneMenu,
    sceneFlags: SceneFlags,
    sceneTimer: SceneTimer,
    scenePause: ScenePause,
    sceneGameOver: SceneGameOver;

function setup() {
    sceneMainMenu = new SceneMainMenu();
    sceneGameField = new SceneGameField();
    sceneMenu = new SceneMenu();
    sceneFlags = new SceneFlags();
    sceneTimer = new SceneTimer();
    scenePause = new ScenePause();
    sceneGameOver = new SceneGameOver();
}