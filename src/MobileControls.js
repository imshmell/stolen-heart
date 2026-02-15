// MobileControls.js
export function addMobileControls(scene) {
  const { width, height } = scene.cameras.main;
  const isMobile = window.innerWidth <= 991;

  // if (!isMobile) return;

  scene.moveLeft = false;
  scene.moveRight = false;

  const makeButton = (x, y, w, h, color, label) => {
    const btn = scene.add
      .rectangle(x, y, w, h, color, 0.3)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(1000); // ставим большой depth

    const btnText = scene.add
      .text(x, y, label, {
        fontFamily: "Pixelify Sans",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(1001); // текст выше прямоугольника

    return btn;
  };

  // --- left button ---
  const leftBtn = makeButton(60, height - 80, 100, 100, 0x888888, "LEFT");
  leftBtn.on("pointerdown", () => (scene.moveLeft = true));
  leftBtn.on("pointerup", () => (scene.moveLeft = false));
  leftBtn.on("pointerout", () => (scene.moveLeft = false));

  // --- right button ---
  const rightBtn = makeButton(200, height - 80, 100, 100, 0x888888, "RIGHT");
  rightBtn.on("pointerdown", () => (scene.moveRight = true));
  rightBtn.on("pointerup", () => (scene.moveRight = false));
  rightBtn.on("pointerout", () => (scene.moveRight = false));

  // --- E button ---
  const eBtn = makeButton(120, height - 220, 120, 120, 0x4444ff, "E");
  eBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-E"));

  // --- big Space button ---
  const spaceBtn = makeButton(120, height - 380, 250, 100, 0xff4444, "SPACE");
  spaceBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-SPACE"));
}
