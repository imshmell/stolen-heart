export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Загружаем стартовую картинку
    this.load.image("start", "assets/start.png");
  }

  async create() {
    // ждём именно Pixelify Sans
    await document.fonts.load('32px "Pixelify Sans"');

    this.startImage = this.add.image(512, 512, "start");

    this.pressText = this.add
      .text(520, 922, "Press SPACE to start", {
        fontFamily: '"Pixelify Sans"',
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }
}
