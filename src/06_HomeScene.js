import {
  addInterface,
  addFace,
  addDialogueText,
  addTaskText,
} from "./UIHelpers.js";

import { createPlayer, updatePlayerMovement } from "./PlayerHelper.js";

import { addMobileControls } from "./MobileControls.js";

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    addMobileControls(this);

    const { width, height } = this.cameras.main;

    // --- background music ---
    this.homeBGM = this.sound.add("homeBGM", { volume: 0.5, loop: true });
    this.homeBGM.play();

    // --- home background ---
    const homeTexture = this.textures.get("home").getSourceImage();
    const scaleHome = width / homeTexture.width;
    const homeHeightScaled = homeTexture.height * scaleHome;

    this.homeImage = this.add
      .image(0, 0, "home")
      .setOrigin(0, 0)
      .setDisplaySize(width, homeHeightScaled)
      .setDepth(0);

    // --- interface and character face ---
    this.interfaceImage = addInterface(this);
    this.faceImage = addFace(this, "face");

    // --- dialogue and task text ---
    this.dialogueText = addDialogueText(
      this,
      "I arrived at the address from the note. The door was slightly open — as if it had been waiting for me. I stepped inside cautiously, listening to the silence. Before me lay a perfectly ordinary apartment: a sofa against the wall, a table strewn with papers, a wardrobe with neatly hung clothes, dumbbells on the floor, and a drying rack by the window. It seems no one was in a hurry to hide their traces. I need to examine the room carefully — every detail could be a clue."
    );

    this.taskText = addTaskText(this, "Explore this place");

    this.player = createPlayer(this, 512, height - 420);

    // --- keyboard input ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;

    // --- interaction zones ---
    this.clothesZone = new Phaser.Geom.Rectangle(560, height - 500, 100, 200);
    this.safeZone = new Phaser.Geom.Rectangle(800, height - 500, 100, 200);

    // --- temporary scene variables ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;

    // --- state flags ---
    this.clothesChecked = false;
    this.safeActive = false;
    this.beeShown = false;
    this.beeImage = null;
    this.beeTextStage = 0;

    // --- key E interaction ---
    this.input.keyboard.on("keydown-E", () => {
      // --- bee text toggle ---
      if (this.beeShown && !this.tempSceneActive) {
        if (this.beeTextStage === 1) {
          this.dialogueText.setText(
            "Now I am here. You’ve completed all the investigation… Found the clues, solved the code… But most importantly… You found me. And now I can finally tell you… I love you, Agent Martins. Will you be my valentine?"
          );
          this.taskText.setText("Press SPACE to continue");
          this.beeTextStage = 2;
        } else if (this.beeTextStage === 2) {
          this.dialogueText.setText(
            "— Were you looking for me, Agent?\n— I… was looking for my heart.\n— It was with you all this time.\n— But… why did it hurt so much?\n— Because I wasn’t there by your side."
          );
          this.taskText.setText("Press E");
          this.beeTextStage = 1;
        }
        return;
      }

      if (!this.tempSceneActive) {
        // --- clothes scene ---
        if (
          !this.clothesChecked &&
          Phaser.Geom.Rectangle.ContainsPoint(this.clothesZone, {
            x: this.player.x,
            y: this.player.y,
          })
        ) {
          this.faceImage.setTexture("wowFace");
          this.taskText.setText("Press E");
          this.tempSceneImage = this.add
            .image(width / 2, -270, "clothesScene")
            .setOrigin(0.5, 0)
            .setDisplaySize(width, homeHeightScaled)
            .setDepth(8);
          this.dialogueText.setText(
            "I approached the neatly folded stack of clothes on the sofa. I feel I know only one person who could handle it so carefully… Oh, a sharp pain in my chest again — I have to stay steady. Next to the clothes lay a note with the word “ЛОЧЬ” in big letters. Hm… some code, possibly a password! It seems someone wants me to solve this puzzle and is guiding me toward the answers. I need to remember it: BE-STO-LOCH. Everything feels strange… but I have to move forward."
          );
          this.tempSceneActive = true;
        }
        // --- safe scene ---
        else if (
          this.clothesChecked &&
          this.safeActive &&
          Phaser.Geom.Rectangle.ContainsPoint(this.safeZone, {
            x: this.player.x,
            y: this.player.y,
          })
        ) {
          this.faceImage.setTexture("wowFace");
          this.taskText.setText("Press E");
          this.tempSceneImage = this.add
            .image(width / 2, -46, "safeScene")
            .setOrigin(0.5, 0)
            .setDisplaySize(width, homeHeightScaled)
            .setDepth(7);
          this.dialogueText.setText(
            "A sharp, familiar voice cuts through the silence from behind me: 'You can’t keep a heart in a safe.' I spin around, chest tightening, heartbeat racing. The room feels smaller, shadows stretching across the walls. My hands tremble slightly as I close the safe and glance around, trying to make sense of what just happened."
          );
          this.tempSceneActive = true;
        }
      } else {
        // --- close temporary scene ---
        if (this.tempSceneImage) {
          this.tempSceneImage.destroy();
          this.tempSceneImage = null;
          this.faceImage.setTexture("face");

          if (!this.clothesChecked) {
            this.clothesChecked = true;
            this.safeActive = true;
            this.taskText.setText("Explore this place");
            this.dialogueText.setText(
              "Hmm… now that I have the code, Bumble must have stolen and hidden my heart in this safe!"
            );
          } else if (this.safeActive && !this.beeShown) {
            this.safeActive = false;
            this.beeShown = true;
            this.beeImage = this.add
              .image(150, 600, "bee")
              .setOrigin(0.5)
              .setDepth(6)
              .setDisplaySize(200, 240);

            this.dialogueText.setText(
              "— Were you looking for me, Agent?\n— I… was looking for my heart.\n— It was with you all this time.\n— But… why did it hurt so much?\n— Because I wasn’t there by your side."
            );
            this.taskText.setText("Press E");
            this.beeTextStage = 1;
            this.faceImage.setTexture("heartFace");
          }

          this.tempSceneActive = false;
        }
      }
    });

    // --- key SPACE interaction ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.beeShown && this.beeTextStage === 2) {
        if (this.homeBGM) this.homeBGM.stop();
        this.scene.start("FinalScene");
      }
    });
  }

  update() {
    if (!this.player) return;

    updatePlayerMovement(this.player, this.cursors, this.speed);

    // --- update task text and face ---
    if (!this.tempSceneActive) {
      if (
        !this.clothesChecked &&
        Phaser.Geom.Rectangle.ContainsPoint(this.clothesZone, {
          x: this.player.x,
          y: this.player.y,
        })
      ) {
        this.taskText.setText("Press E");
        this.faceImage.setTexture("wowFace");
      } else if (
        this.safeActive &&
        Phaser.Geom.Rectangle.ContainsPoint(this.safeZone, {
          x: this.player.x,
          y: this.player.y,
        })
      ) {
        this.taskText.setText("Press E");
        this.faceImage.setTexture("wowFace");
      } else if (this.beeShown && this.beeTextStage === 1) {
        this.taskText.setText("Press E");
      } else if (this.beeShown && this.beeTextStage === 2) {
        this.taskText.setText("Press SPACE to continue");
      } else {
        this.faceImage.setTexture("face");
        this.taskText.setText("Explore this place");
      }
    }
  }
}
