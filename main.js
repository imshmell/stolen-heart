import BootScene from "./js/BootScene.js";
import GameScene from "./js/GameScene.js";
import EntranceScene from "./js/EntranceScene.js";
import OfficeScene from "./js/OfficeScene.js";
import KitchenScene from "./js/KitchenScene.js";
import HomeScene from "./js/HomeScene.js";
import finalScene from "./js/finalScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 1024,
  parent: "game-container",
  scene: [
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
