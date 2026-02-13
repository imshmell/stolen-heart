// KitchenScene.js
export default class KitchenScene extends Phaser.Scene {
  constructor() {
    super("KitchenScene");
  }

  preload() {
    // --- интерфейс и фон ---
    this.load.image("interface", "assets/interface.png");
    this.load.image("kitchen", "assets/kitchen.png");

    // --- лица ---
    this.load.image("face", "assets/face.png");
    this.load.image("wowFace", "assets/wowFace.png");

    // --- персонаж ---
    this.load.image("player_idle", "assets/player_idle.png");
    this.load.image("player_walk1", "assets/player_walk1.png");
    this.load.image("player_walk2", "assets/player_walk2.png");
    this.load.image("player_walk3", "assets/player_walk3.png");

    // --- временная сцена холодильника ---
    this.load.image("refrigeratorScene", "assets/refrigeratorScene.png");

    this.load.audio("kitchenBGM", "assets/music/kitchen.flac");
  }

  create() {
    this.kitchenBGM = this.sound.add("kitchenBGM", {
      volume: 0.5,
      loop: true,
    });
    this.kitchenBGM.play();

    const width = this.game.config.width;
    const height = this.game.config.height;

    // --- фон кухни ---
    const kitchenTexture = this.textures.get("kitchen").getSourceImage();
    const scaleKitchen = width / kitchenTexture.width;
    const kitchenHeightScaled = kitchenTexture.height * scaleKitchen;

    this.kitchenImage = this.add
      .image(0, 200, "kitchen")
      .setOrigin(0, 0)
      .setDisplaySize(width, kitchenHeightScaled)
      .setDepth(0);

    // --- интерфейс ---
    this.interfaceImage = this.add
      .image(width / 2, height / 2, "interface")
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setDepth(10);

    // --- лицо ---
    this.faceImage = this.add
      .image(160, height - 162, "face")
      .setOrigin(0.5)
      .setDisplaySize(182, 182)
      .setDepth(8);

    // --- текст снизу ---
    this.dialogueText = this.add
      .text(
        width - 50,
        height - 62,
        "Hmm… the kitchen seems empty. So who could have made that loud clunk? Where did it come from? Weird… maybe I should go check the fridge and see what’s going on.",
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

    // --- задание ---
    this.taskText = this.add
      .text(width / 2, 130, "Check refrigerator", {
        fontFamily: "Pixelify Sans",
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(12);

    // --- персонаж ---
    this.player = this.add
      .sprite(512, height - 420, "player_idle")
      .setOrigin(0.5)
      .setDisplaySize(200, 240)
      .setDepth(7);

    // --- анимации ---
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

    // --- управление ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;

    // --- зона холодильника ---
    this.refrigeratorZone = new Phaser.Geom.Rectangle(
      780,
      height - 550,
      110,
      200
    );

    // --- состояния ---
    this.tempSceneActive = false;
    this.tempSceneImage = null;
    this.fridgeDone = false; // холодильник закрыт и сцена просмотрена
    this.spaceActive = false;

    // --- клавиша E ---
    this.input.keyboard.on("keydown-E", () => {
      if (!this.tempSceneActive) {
        // --- открыть холодильник только если еще не делали ---
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
        // --- закрытие сцены холодильника ---
        if (this.tempSceneImage) {
          this.tempSceneImage.destroy();
          this.tempSceneImage = null;
          this.tempSceneActive = false;
          this.fridgeDone = true; // холодильник просмотрен
          this.spaceActive = true; // теперь можно SPACE

          this.faceImage.setTexture("face");
          this.dialogueText.setText(
            "I close the fridge. This is a clue. I need to check the address on the note — maybe the suspect is there. Clutching my chest, a sharp pain shoots through me. Oh… I hope I’ll make it, and I’ll find her before it gets worse. Where’s my taxi app?.. I need to call a ride, fast. Meanwhile, I quickly glance around the kitchen: empty shelves, scattered dishes, but not a soul. Everything looks ordinary… yet my heart tells me this place is somehow connected to the case."
          );
          this.taskText.setText("Press SPACE to continue");
        }
      }
    });

    // --- клавиша SPACE ---
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.spaceActive) {
        if (this.kitchenBGM) {
          this.kitchenBGM.stop();
        }
        this.scene.start("HomeScene"); // переход в следующую сцену
      }
    });
  }

  update() {
    if (!this.player) return;

    if (this.cursors.left.isDown) {
      this.player.x -= this.speed;
      this.player.flipX = true;
      this.player.anims.play("walk_left", true);
    } else if (this.cursors.right.isDown) {
      this.player.x += this.speed;
      this.player.flipX = false;
      this.player.anims.play("walk_right", true);
    } else {
      this.player.anims.stop();
      this.player.setTexture("player_idle");
    }

    // --- обновление taskText ---
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
