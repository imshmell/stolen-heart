// OfficeScene.js
export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super("OfficeScene");
  }

  preload() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    // --- ассеты интерфейса и сцены ---
    this.load.image("interface", "assets/interface.png");
    this.load.image("office", "assets/office.png");

    // --- лица персонажа ---
    this.load.image("tiredFace", "assets/tiredFace.png");
    this.load.image("wowFace", "assets/wowFace.png");
    this.load.image("cuteFace", "assets/cuteFace.png");

    // --- персонаж и анимация ---
    this.load.image("player_idle", "assets/player_idle.png");
    this.load.image("player_walk1", "assets/player_walk1.png");
    this.load.image("player_walk2", "assets/player_walk2.png");
    this.load.image("player_walk3", "assets/player_walk3.png");

    // --- временные картинки для интеракции ---
    this.load.image("coffeeScene", "assets/coffeeScene.png");
    this.load.image("taskScene", "assets/taskScene.png");

    this.load.audio("officeBGM", "assets/music/office.wav");
  }

  create() {
    this.officeBGM = this.sound.add("officeBGM", {
      volume: 0.5,
      loop: true,
    });
    this.officeBGM.play();

    const width = this.game.config.width;
    const height = this.game.config.height;

    // --- 1. Серединная картинка office ---
    const officeTexture = this.textures.get("office").getSourceImage();
    const scaleOffice = width / officeTexture.width;
    const officeHeightScaled = officeTexture.height * scaleOffice;

    this.officeImage = this.add
      .image(0, 244, "office")
      .setOrigin(0, 0)
      .setDisplaySize(width, officeHeightScaled)
      .setDepth(0);

    // --- 2. Интерфейс ---
    this.interfaceImage = this.add
      .image(width / 2, height / 2, "interface")
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setDepth(10);

    // --- 3. Лицо персонажа ---
    this.faceImage = this.add
      .image(160, height - 162, "tiredFace")
      .setOrigin(0.5)
      .setDisplaySize(182, 182)
      .setDepth(8);

    // --- 4. Текст внизу справа ---
    this.dialogueText = this.add
      .text(
        width - 50,
        height - 80,
        `You enter your familiar office. Soft light reflects off the glass partitions, neat stacks of papers lie on the desks, and you can hear the footsteps of colleagues in the corridor. Before sitting down to work, you decide to pour yourself a cup of coffee — the morning ritual.`,
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
      .text(width / 2, 130, "Make yourself a coffee", {
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
    this.coffeeZone = new Phaser.Geom.Rectangle(660, height - 500, 80, 200);
    this.tasksZone = new Phaser.Geom.Rectangle(240, height - 500, 100, 200);

    // --- 10. Временная переменная ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;

    // --- 11. Флаги активности сцен ---
    this.coffeeDone = false;
    this.computerActive = false; // компьютер активен только после кофе
    this.computerDone = false;
    this.spaceActive = false;

    // --- 12. Нажатие E ---
    this.input.keyboard.on("keydown-E", () => {
      if (!this.tempSceneActive) {
        // --- кофе ---
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
        // --- компьютер (только если кофе выпито) ---
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
        // --- закрываем временную сцену ---
        if (this.tempSceneImage) {
          this.tempSceneImage.destroy();
          this.tempSceneImage = null;
          this.faceImage.setTexture("cuteFace");

          if (!this.coffeeDone) {
            this.coffeeDone = true;
            this.computerActive = true; // теперь компьютер доступен
            this.taskText.setText("Check your computer");
            this.dialogueText.setText(
              "I should check my computer and see what’s going on."
            );
          } else if (!this.computerDone) {
            this.computerDone = true;
            this.spaceActive = true; // теперь пробел активен
            this.taskText.setText("Press SPACE to continue");
            this.dialogueText.setText(
              "'Bang!' Whoa… someone just slammed the fridge door! Looks like they got here before me. I should go over and say hi to my colleague."
            );
          }

          this.tempSceneActive = false;
        }
      }
    });

    // --- 13. Нажатие SPACE ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.spaceActive) {
        if (this.officeBGM) {
          this.officeBGM.stop();
        }
        this.scene.start("KitchenScene");
      }
    });
  }

  update() {
    if (!this.player) return;

    const cursors = this.cursors;

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

    // --- обновление taskText ---
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
