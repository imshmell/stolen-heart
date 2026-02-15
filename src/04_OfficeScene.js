import {
  addInterface,
  addFace,
  addDialogueText,
  addTaskText,
} from "./UIHelpers.js";

import { createPlayer, updatePlayerMovement } from "./PlayerHelper.js";

import { addMobileControls } from "./MobileControls.js";

export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super("OfficeScene");
  }

  create() {
    addMobileControls(this);

    const { width, height } = this.cameras.main;

    // --- background music ---
    this.officeBGM = this.sound.add("officeBGM", { volume: 0.5, loop: true });
    this.officeBGM.play();

    // --- office background ---
    const officeTexture = this.textures.get("office").getSourceImage();
    const scaleOffice = width / officeTexture.width;
    const officeHeightScaled = officeTexture.height * scaleOffice;

    this.officeImage = this.add
      .image(0, 244, "office")
      .setOrigin(0, 0)
      .setDisplaySize(width, officeHeightScaled)
      .setDepth(0);

    // --- interface and character face ---
    this.interfaceImage = addInterface(this);
    this.faceImage = addFace(this, "tiredFace");

    // --- dialogue and task text ---
    this.dialogueText = addDialogueText(
      this,
      "You enter your familiar office. Soft light reflects off the glass partitions, neat stacks of papers lie on the desks, and you can hear the footsteps of colleagues in the corridor. Before sitting down to work, you decide to pour yourself a cup of coffee — the morning ritual."
    );

    this.taskText = addTaskText(this, "Make yourself a coffee");

    this.player = createPlayer(this, 512, height - 420);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;

    // --- interaction zones ---
    this.coffeeZone = new Phaser.Geom.Rectangle(660, height - 500, 80, 200);
    this.tasksZone = new Phaser.Geom.Rectangle(240, height - 500, 100, 200);

    // --- temporary scene variables ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;
    this.coffeeDone = false;
    this.computerActive = false;
    this.computerDone = false;
    this.spaceActive = false;

    // --- key E interaction ---
    this.input.keyboard.on("keydown-E", () => {
      if (!this.tempSceneActive) {
        // --- coffee scene ---
        if (
          !this.coffeeDone &&
          Phaser.Geom.Rectangle.ContainsPoint(this.coffeeZone, {
            x: this.player.x,
            y: this.player.y,
          })
        ) {
          this.faceImage.setTexture("wowFace");
          this.dialogueText.setText(
            "Mmm… smells nice. Oh? What’s this? There’s “BE” written on the mug. That’s strange… who would leave something like that? Huh. Well, whatever. I should go check my tasks."
          );
          this.taskText.setText("Press E to close");
          this.tempSceneImage = this.add
            .image(width / 2, 110, "coffeeScene")
            .setOrigin(0.5, 0)
            .setDisplaySize(width, officeHeightScaled)
            .setDepth(8);
          this.tempSceneActive = true;
        }
        // --- computer scene (only after coffee) ---
        else if (
          this.coffeeDone &&
          !this.computerDone &&
          Phaser.Geom.Rectangle.ContainsPoint(this.tasksZone, {
            x: this.player.x,
            y: this.player.y,
          })
        ) {
          this.faceImage.setTexture("wowFace");
          this.dialogueText.setText(
            "So, what do I have on my agenda today? Hmm… Case #270. That’s strange. Ouch… my chest hurts. I’ve never heard of this case before. 'Agent Martins, we have a special assignment for you. Your heart is missing. Suspect: Bumblebee. Distinguishing features: clever, beautiful, fond of Italian cuisine.' Who is this? I don’t know her… interesting."
          );
          this.taskText.setText("Press E to close");
          this.tempSceneImage = this.add
            .image(width / 2, 244, "taskScene")
            .setOrigin(0.5, 0)
            .setDisplaySize(width, officeHeightScaled)
            .setDepth(7);
          this.tempSceneActive = true;
        }
      } else {
        // --- close temporary scene ---
        if (this.tempSceneImage) {
          this.tempSceneImage.destroy();
          this.tempSceneImage = null;
          this.faceImage.setTexture("cuteFace");

          if (!this.coffeeDone) {
            this.coffeeDone = true;
            this.computerActive = true;
            this.taskText.setText("Check your computer");
            this.dialogueText.setText(
              "I should check my computer and see what’s going on."
            );
          } else if (!this.computerDone) {
            this.computerDone = true;
            this.spaceActive = true;
            this.taskText.setText("Press SPACE to continue");
            this.dialogueText.setText(
              "'Bang!' Whoa… someone just slammed the fridge door! Looks like they got here before me. I should go over and say hi to my colleague."
            );
          }

          this.tempSceneActive = false;
        }
      }
    });

    // --- key SPACE interaction ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.spaceActive) {
        if (this.officeBGM) this.officeBGM.stop();
        this.scene.start("KitchenScene");
      }
    });
  }

  update() {
    if (!this.player) return;

    updatePlayerMovement(this.player, this.cursors, this.speed);

    // --- update task text ---
    if (!this.tempSceneActive) {
      if (
        !this.coffeeDone &&
        Phaser.Geom.Rectangle.ContainsPoint(this.coffeeZone, {
          x: this.player.x,
          y: this.player.y,
        })
      ) {
        this.taskText.setText("Press E");
      } else if (
        this.computerActive &&
        !this.computerDone &&
        Phaser.Geom.Rectangle.ContainsPoint(this.tasksZone, {
          x: this.player.x,
          y: this.player.y,
        })
      ) {
        this.taskText.setText("Press E");
      } else if (this.spaceActive) {
        this.taskText.setText("Press SPACE to continue");
      } else if (!this.coffeeDone) {
        this.taskText.setText("Make yourself a coffee");
      } else if (!this.computerDone) {
        this.taskText.setText("Check your computer");
      }
    }
  }
}
