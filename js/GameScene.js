export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("commute", "assets/commute.png");
    this.load.audio("commuteBGM", "assets/music/commute.wav");
  }

  create() {
    this.commuteBGM = this.sound.add("commuteBGM", {
      volume: 0.5,
      loop: true,
    });
    this.commuteBGM.play();

    this.commuteImage = this.add.image(0, 0, "commute").setOrigin(0, 0);

    // масштабируем по высоте канваса
    const scaleY = this.game.config.height / this.commuteImage.height;
    this.commuteImage.setScale(scaleY);

    this.commuteWidth = this.commuteImage.displayWidth;
    this.speed = 2;

    this.travelled = 0;
    this.travelDistance = 1024; // сколько проехать до конца сцены
    this.transitionStarted = false; // флаг, чтобы таймер сработал один раз
  }

  update() {
    // Двигаем картинку
    if (!this.transitionStarted) {
      this.commuteImage.x -= this.speed;
      this.travelled += this.speed;

      // проверяем, достигли нужного расстояния
      if (this.travelled >= this.travelDistance) {
        this.transitionStarted = true; // включаем флаг, чтобы таймер не запускался снова

        // останавливаем движение
        this.speed = 0;

        // через 3 секунды переходим в EntranceScene
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
