import {
  addInterface,
  addFace,
  addDialogueText,
  addTaskText,
} from "./UIHelpers.js";

export default class EntranceScene extends Phaser.Scene {
  constructor() {
    super("EntranceScene");
  }

  create() {
    this.entranceBGM = this.sound.add("entranceBGM", {
      volume: 0.5,
      loop: true,
    });

    this.entranceBGM.play();

    const { width, height } = this.cameras.main;

    const deltaTexture = this.textures.get("delta").getSourceImage();

    this.deltaImage = this.add
      .image(0, 244, "delta")
      .setOrigin(0, 0)
      .setDisplaySize(
        width,
        deltaTexture.height * (width / deltaTexture.width)
      );
    this.deltaImage.setDepth(0);

    this.interfaceImage = addInterface(this);
    this.faceImage = addFace(this, "tiredFace");
    this.dialogueText = addDialogueText(
      this,
      `You exit the taxi and see the glass building of the business center "Delta". Morning, gentle sunlight plays on the windows.
You light a cigarette, drowsily thinking about the tasks of the day. A slight strange pain in your chest, but you decide it will pass.
You walk past the sullen security guards and climb the stairs. The pain intensifies, but you ignore it — work must be done.
    `
    );

    this.taskText = addTaskText(this, "Press SPACE to continue");

    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.entranceBGM) {
        this.entranceBGM.stop();
      }
      this.scene.start("OfficeScene");
    });
  }
}
