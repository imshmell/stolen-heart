import {
  addInterface,
  addFace,
  addDialogueText,
  addTaskText,
} from "./UIHelpers.js";

import { createPlayer, updatePlayerMovement } from "./PlayerHelper.js";

export default class KitchenScene extends Phaser.Scene {
  constructor() {
    super("KitchenScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // --- background music ---
    this.kitchenBGM = this.sound.add("kitchenBGM", { volume: 0.5, loop: true });
    this.kitchenBGM.play();

    // --- kitchen background ---
    const kitchenTexture = this.textures.get("kitchen").getSourceImage();
    const scaleKitchen = width / kitchenTexture.width;
    const kitchenHeightScaled = kitchenTexture.height * scaleKitchen;

    this.kitchenImage = this.add
      .image(0, 200, "kitchen")
      .setOrigin(0, 0)
      .setDisplaySize(width, kitchenHeightScaled)
      .setDepth(0);

    // --- interface and character face ---
    this.interfaceImage = addInterface(this);
    this.faceImage = addFace(this, "face");

    // --- dialogue and task text ---
    this.dialogueText = addDialogueText(
      this,
      "Hmm… the kitchen seems empty. So who could have made that loud clunk? Where did it come from? Weird… maybe I should go check the fridge and see what’s going on.",
      { yOffset: 62 } // optional adjustment if needed
    );

    this.taskText = addTaskText(this, "Check refrigerator");

    this.player = createPlayer(this, 512, height - 420);

    // --- keyboard input ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;

    // --- fridge interaction zone ---
    this.refrigeratorZone = new Phaser.Geom.Rectangle(
      780,
      height - 550,
      110,
      200
    );

    // --- temporary scene variables ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;
    this.fridgeDone = false;
    this.spaceActive = false;

    // --- key E interaction ---
    this.input.keyboard.on("keydown-E", () => {
      if (!this.tempSceneActive) {
        // --- open fridge scene ---
        if (
          !this.fridgeDone &&
          Phaser.Geom.Rectangle.ContainsPoint(this.refrigeratorZone, {
            x: this.player.x,
            y: this.player.y,
          })
        ) {
          this.faceImage.setTexture("wowFace");
          this.dialogueText.setText(
            "The fridge was almost empty… except for a single container of carbonara, and a strange note lying beside it. Squinting, I tried to make out what was written. At first, it was hard to read… then I could just make out 'СТО'. Next to it, some kind of address: Bakinskaya 13. Weird… it’s eerily familiar, almost like the suspect is leaving clues. And again… a sharp pang in my chest. I let out a small gasp."
          );
          this.taskText.setText("Press E to close");

          this.tempSceneImage = this.add
            .image(width / 2, 100, "refrigeratorScene")
            .setOrigin(0.5, 0)
            .setDisplaySize(width, kitchenHeightScaled)
            .setDepth(7);

          this.tempSceneActive = true;
        }
      } else {
        // --- close fridge scene ---
        if (this.tempSceneImage) {
          this.tempSceneImage.destroy();
          this.tempSceneImage = null;
          this.tempSceneActive = false;
          this.fridgeDone = true;
          this.spaceActive = true;

          this.faceImage.setTexture("face");
          this.dialogueText.setText(
            "I close the fridge. This is a clue. I need to check the address on the note — maybe the suspect is there. Clutching my chest, a sharp pain shoots through me. Oh… I hope I’ll make it, and I’ll find her before it gets worse. Where’s my taxi app?.. I need to call a ride, fast. Meanwhile, I quickly glance around the kitchen: empty shelves, scattered dishes, but not a soul. Everything looks ordinary… yet my heart tells me this place is somehow connected to the case."
          );
          this.taskText.setText("Press SPACE to continue");
        }
      }
    });

    // --- key SPACE interaction ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.spaceActive) {
        if (this.kitchenBGM) this.kitchenBGM.stop();
        this.scene.start("HomeScene");
      }
    });
  }

  update() {
    if (!this.player) return;

    updatePlayerMovement(this.player, this.cursors, this.speed);

    // --- update task text ---
    if (!this.tempSceneActive && !this.fridgeDone) {
      if (
        Phaser.Geom.Rectangle.ContainsPoint(this.refrigeratorZone, {
          x: this.player.x,
          y: this.player.y,
        })
      ) {
        this.taskText.setText("Press E");
        this.faceImage.setTexture("wowFace");
      } else {
        this.taskText.setText("Check refrigerator");
        this.faceImage.setTexture("face");
      }
    } else if (this.fridgeDone) {
      this.taskText.setText("Press SPACE to continue");
    }
  }
}
