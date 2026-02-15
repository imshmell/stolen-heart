export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.commuteBGM = this.sound.add("commuteBGM", {
      volume: 0.5,
      loop: true,
    });
    this.commuteBGM.play();

    this.commuteImage = this.add.image(0, 0, "commute").setOrigin(0, 0);

    const scaleY = this.game.config.height / this.commuteImage.height;
    this.commuteImage.setScale(scaleY);

    this.commuteWidth = this.commuteImage.displayWidth;
    this.speed = 2;

    this.travelled = 0;
    this.travelDistance = 1024;
    this.transitionStarted = false;
  }

  update() {
    if (!this.transitionStarted) {
      this.commuteImage.x -= this.speed;
      this.travelled += this.speed;

      if (this.travelled >= this.travelDistance) {
        this.transitionStarted = true;

        this.speed = 0;

        this.time.delayedCall(3000, () => {
          if (this.commuteBGM) {
            this.commuteBGM.stop();
          }
          this.scene.start("EntranceScene");
        });
      }
    }
  }
}
