export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  async create() {
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
      // this.scene.start("OfficeScene");
    });
  }
}
