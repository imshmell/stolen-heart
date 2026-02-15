import PreloadScene from "./src/00_PreloadScene.js";

import BootScene from "./src/01_BootScene.js";
import GameScene from "./src/02_GameScene.js";
import EntranceScene from "./src/03_EntranceScene.js";
import OfficeScene from "./src/04_OfficeScene.js";
import KitchenScene from "./src/05_KitchenScene.js";
import HomeScene from "./src/06_HomeScene.js";
import finalScene from "./src/07_FinalScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 1024,
  parent: "game-container",
  scene: [
    PreloadScene,
    BootScene,
    GameScene,
    EntranceScene,
    OfficeScene,
    KitchenScene,
    HomeScene,
    finalScene,
  ],
  physics: { default: "arcade" },
  backgroundColor: "#000000",
};

const game = new Phaser.Game(config);
