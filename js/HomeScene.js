// HomeScene.js
export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  preload() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    // --- ассеты интерфейса и сцены ---
    this.load.image("interface", "assets/interface.png");
    this.load.image("home", "assets/home.png");

    // --- лица персонажа ---
    this.load.image("face", "assets/face.png");
    this.load.image("wowFace", "assets/wowFace.png");
    this.load.image("heartFace", "assets/heartFace.png");

    // --- персонаж и анимация ---
    this.load.image("player_idle", "assets/player_idle.png");
    this.load.image("player_walk1", "assets/player_walk1.png");
    this.load.image("player_walk2", "assets/player_walk2.png");
    this.load.image("player_walk3", "assets/player_walk3.png");

    // --- временные сцены ---
    this.load.image("clothesScene", "assets/clothes.png");
    this.load.image("safeScene", "assets/safeScene.png");

    // --- новая картинка bee ---
    this.load.image("bee", "assets/bee.png");

    this.load.audio("homeBGM", "assets/music/home.wav");
  }

  create() {
    this.homeBGM = this.sound.add("homeBGM", {
      volume: 0.5,
      loop: true,
    });
    this.homeBGM.play();

    const width = this.game.config.width;
    const height = this.game.config.height;

    // --- 1. Серединная картинка home ---
    const homeTexture = this.textures.get("home").getSourceImage();
    const scaleHome = width / homeTexture.width;
    const homeHeightScaled = homeTexture.height * scaleHome;

    this.homeImage = this.add
      .image(0, 0, "home")
      .setOrigin(0, 0)
      .setDisplaySize(width, homeHeightScaled)
      .setDepth(0);

    // --- 2. Интерфейс ---
    this.interfaceImage = this.add
      .image(width / 2, height / 2, "interface")
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setDepth(10);

    // --- 3. Лицо персонажа ---
    this.faceImage = this.add
      .image(160, height - 162, "face")
      .setOrigin(0.5)
      .setDisplaySize(182, 182)
      .setDepth(8);

    // --- 4. Текст внизу ---
    this.dialogueText = this.add
      .text(
        width - 50,
        height - 60,
        "I arrived at the address from the note. The door was slightly open — as if it had been waiting for me. I stepped inside cautiously, listening to the silence. Before me lay a perfectly ordinary apartment: a sofa against the wall, a table strewn with papers, a wardrobe with neatly hung clothes, dumbbells on the floor, and a drying rack by the window. It seems no one was in a hurry to hide their traces. I need to examine the room carefully — every detail could be a clue.",
        {
          fontFamily: "Pixelify Sans",
          fontSize: "24px",
          color: "#ffffff",
          wordWrap: { width: 650, useAdvancedWrap: true },
          align: "left",
        }
      )
      .setOrigin(1, 1)
      .setDepth(12);

    // --- 5. Верхняя полоска с заданием ---
    this.taskText = this.add
      .text(width / 2, 130, "Explore this place", {
        fontFamily: "Pixelify Sans",
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(12);

    // --- 6. Создаем персонажа ---
    this.player = this.add
      .sprite(512, height - 420, "player_idle")
      .setOrigin(0.5)
      .setDisplaySize(200, 240)
      .setDepth(7);

    // --- 7. Анимации ходьбы ---
    this.anims.create({
      key: "walk_right",
      frames: [
        { key: "player_walk1" },
        { key: "player_walk2" },
        { key: "player_walk3" },
        { key: "player_walk2" },
      ],
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "walk_left",
      frames: [
        { key: "player_walk1" },
        { key: "player_walk2" },
        { key: "player_walk3" },
        { key: "player_walk2" },
      ],
      frameRate: 8,
      repeat: -1,
    });

    // --- 8. Курсоры ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;

    // --- 9. Зоны интеракции ---
    this.clothesZone = new Phaser.Geom.Rectangle(560, height - 500, 100, 200);
    this.safeZone = new Phaser.Geom.Rectangle(800, height - 500, 100, 200);

    // --- 10. Временная сцена ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;

    // --- 11. Флаги активности ---
    this.clothesChecked = false;
    this.safeActive = false;
    this.beeShown = false;
    this.beeImage = null;
    this.beeTextStage = 0;

    // --- 12. Визуализация зон ---
    // const graphics = this.add.graphics();
    // graphics.lineStyle(2, 0xff0000, 1);
    // graphics.strokeRectShape(this.clothesZone);
    // graphics.strokeRectShape(this.safeZone);
    // graphics.setDepth(20);

    // --- 13. Нажатие E ---
    this.input.keyboard.on("keydown-E", () => {
      // --- переключение текста пчелы ---
      if (this.beeShown && !this.tempSceneActive) {
        if (this.beeTextStage === 1) {
          this.dialogueText.setText(
            "Тow I am here. You’ve completed all the investigation… Found the clues, solved the code… But most importantly… You found me. And now I can finally tell you… I love you, Agent Martins. Will you be my valentine?"
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
        return; // останавливаем дальнейшую обработку E
      }

      if (!this.tempSceneActive) {
        // --- одежда ---
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
        // --- сейф ---
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
        // --- закрытие временной сцены ---
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

    // --- 14. Пробел ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.beeShown && this.beeTextStage === 2) {
        // if (this.homeBGM) {
        this.homeBGM.stop();
        // }
        this.scene.start("FinalScene"); // переход в следующую сцену
      }
    });
  }

  update() {
    if (!this.player) return;

    const cursors = this.cursors;

    // --- движение ---
    if (cursors.left.isDown) {
      this.player.x -= this.speed;
      this.player.flipX = true;
      this.player.anims.play("walk_left", true);
    } else if (cursors.right.isDown) {
      this.player.x += this.speed;
      this.player.flipX = false;
      this.player.anims.play("walk_right", true);
    } else {
      this.player.anims.stop();
      this.player.setTexture("player_idle");
    }

    // --- проверка зон для подсказки Press E ---
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
