export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const { width, height } = this.cameras.main;

    // --- Graphics for progress bar ---
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    // --- Loading percentage text ---
    const percentText = this.add
      .text(width / 2, height / 2 + 40, "0%", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // --- Load progress events ---
    this.load.on("progress", value => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        width / 4 + 10,
        height / 2 - 20,
        (width / 2 - 20) * value,
        30
      );
      percentText.setText(parseInt(value * 100) + "%");
    });

    this.load.on("complete", async () => {
      await document.fonts.load('32px "Pixelify Sans"');
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();
      loadingText.destroy();
    });

    // --- Preload all assets ---

    // Backgrounds and interface images
    this.load.image("start", "assets/images/start.png");
    this.load.image("commute", "assets/images/commute.png");
    this.load.image("interface", "assets/images/interface.png");
    this.load.image("delta", "assets/images/delta.png");
    this.load.image("office", "assets/images/office.png");
    this.load.image("kitchen", "assets/images/kitchen.png");
    this.load.image("home", "assets/images/home.png");
    this.load.image("final", "assets/images/final.png");

    // Character faces
    this.load.image("tiredFace", "assets/images/tiredFace.png");
    this.load.image("wowFace", "assets/images/wowFace.png");
    this.load.image("cuteFace", "assets/images/cuteFace.png");
    this.load.image("face", "assets/images/face.png");
    this.load.image("heartFace", "assets/images/heartFace.png");

    // Player character and animation frames
    this.load.image("player_idle", "assets/images/player_idle.png");
    this.load.image("player_walk1", "assets/images/player_walk1.png");
    this.load.image("player_walk2", "assets/images/player_walk2.png");
    this.load.image("player_walk3", "assets/images/player_walk3.png");

    // Temporary/interactable scene objects
    this.load.image("coffeeScene", "assets/images/coffeeScene.png");
    this.load.image("taskScene", "assets/images/taskScene.png");
    this.load.image("refrigeratorScene", "assets/images/refrigeratorScene.png");
    this.load.image("clothesScene", "assets/images/clothes.png");
    this.load.image("safeScene", "assets/images/safeScene.png");
    this.load.image("bee", "assets/images/bee.png");

    // Audio assets
    this.load.audio("commuteBGM", "assets/music/commute.wav");
    this.load.audio("entranceBGM", "assets/music/entrance.mp3");
    this.load.audio("officeBGM", "assets/music/office.wav");
    this.load.audio("kitchenBGM", "assets/music/kitchen.flac");
    this.load.audio("homeBGM", "assets/music/home.wav");
    this.load.audio("finalBGM", "assets/music/final.mp3");
  }

  create() {
    // Start the next scene
    this.scene.start("BootScene");
  }
}
