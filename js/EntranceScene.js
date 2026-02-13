export default class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
  }

  preload() {
    this.load.image("interface", "assets/interface.png");
    this.load.image("delta", "assets/delta.png");
    this.load.image("tiredFace", "assets/tiredFace.png");
    this.load.audio("entranceBGM", "assets/music/entrance.mp3");
  }

  create() {
    this.entranceBGM = this.sound.add("entranceBGM", {
      volume: 0.5,
      loop: true,
    });
    this.entranceBGM.play();

    const width = this.game.config.width;
    const height = this.game.config.height;

    // 1. Серединная картинка Delta
    const deltaTexture = this.textures.get("delta").getSourceImage();
    const scaleDelta = width / deltaTexture.width;
    const deltaHeightScaled = deltaTexture.height * scaleDelta;

    this.deltaImage = this.add
      .image(0, 244, "delta")
      .setOrigin(0, 0) // левый верхний угол
      .setDisplaySize(
        width,
        deltaTexture.height * (width / deltaTexture.width)
      );
    this.deltaImage.setDepth(0);

    // 2. Интерфейс поверх середины
    this.interfaceImage = this.add
      .image(width / 2, height / 2, "interface")
      .setOrigin(0.5)
      .setDisplaySize(width, height);
    this.interfaceImage.setDepth(1);

    // 3. Лицо персонажа внизу слева
    this.faceImage = this.add
      .image(160, height - 162, "tiredFace")
      .setOrigin(0.5)
      .setDisplaySize(182, 182);
    this.faceImage.setDepth(2);

    // 4. Текст внизу справа
    const textContent = `
You exit the taxi and see the glass building of the business center "Delta". Morning, gentle sunlight plays on the windows.
You light a cigarette, drowsily thinking about the tasks of the day. A slight strange pain in your chest, but you decide it will pass.
You walk past the sullen security guards and climb the stairs. The pain intensifies, but you ignore it — work must be done.
    `;
    this.dialogueText = this.add
      .text(width - 50, height - 54, textContent, {
        fontFamily: "Pixelify Sans",
        fontSize: "24px",
        color: "#ffffff",
        wordWrap: { width: 650, useAdvancedWrap: true },
        align: "left",
      })
      .setOrigin(1, 1)
      .setDepth(3);

    // 5. Верхняя полоска с заданием (сейчас с фразой)
    this.taskText = this.add
      .text(width / 2, 130, "Press SPACE to continue", {
        fontFamily: "Pixelify Sans",
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2);

    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.entranceBGM) {
        this.entranceBGM.stop();
      }
      this.scene.start("OfficeScene"); // переход в следующую сцену
    });
  }
}
