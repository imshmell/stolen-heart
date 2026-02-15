export default class FinalScene extends Phaser.Scene {
  constructor() {
    super("FinalScene");
  }

  preload() {
    const width = this.game.config.width;
    const height = this.game.config.height;
  }

  create() {
    this.finalBGM = this.sound.add("finalBGM", {
      volume: 0.5,
      loop: true,
    });
    this.finalBGM.play();

    const width = this.game.config.width;
    const height = this.game.config.height;

    this.add
      .image(width / 2, height / 2, "final")
      .setOrigin(0.5)
      .setDisplaySize(width, height);
  }
}
