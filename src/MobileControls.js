// MobileControls.js
export function addMobileControls(scene) {
  const { width, height } = scene.cameras.main;
  const isMobile = window.innerWidth <= 991;

  if (!isMobile) return;

  // --- movement flags ---
  scene.moveLeft = false;
  scene.moveRight = false;

  // --- helper function для кнопки с текстом ---
  const makeButton = (x, y, w, h, color, label) => {
    const btn = scene.add
      .rectangle(x, y, w, h, color, 0.3) // 0.3 alpha для прозрачности
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);

    // текст кнопки
    const btnText = scene.add
      .text(x, y, label, {
        fontFamily: "Pixelify Sans",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(21);

    return btn;
  };

  // --- left button ---
  const leftBtn = makeButton(60, height - 80, 100, 100, 0x888888, "LEFT");
  leftBtn.on("pointerdown", () => (scene.moveLeft = true));
  leftBtn.on("pointerup", () => (scene.moveLeft = false));
  leftBtn.on("pointerout", () => (scene.moveLeft = false));
  leftBtn.on("pointertap", () => {
    scene.moveLeft = true;
    scene.time.delayedCall(100, () => (scene.moveLeft = false));
  });

  // --- right button ---
  const rightBtn = makeButton(200, height - 80, 100, 100, 0x888888, "RIGHT");
  rightBtn.on("pointerdown", () => (scene.moveRight = true));
  rightBtn.on("pointerup", () => (scene.moveRight = false));
  rightBtn.on("pointerout", () => (scene.moveRight = false));
  rightBtn.on("pointertap", () => {
    scene.moveRight = true;
    scene.time.delayedCall(100, () => (scene.moveRight = false));
  });

  // --- E button ---
  const eBtn = makeButton(120, height - 220, 120, 120, 0x4444ff, "E");
  eBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-E"));
  eBtn.on("pointertap", () => scene.input.keyboard.emit("keydown-E"));

  // --- big Space button (second row) ---
  const spaceBtn = makeButton(120, height - 380, 250, 100, 0xff4444, "SPACE");
  spaceBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-SPACE"));
  spaceBtn.on("pointertap", () => scene.input.keyboard.emit("keydown-SPACE"));
}
