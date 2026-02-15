// MobileControls.js
export function addMobileControls(scene) {
  const { width, height } = scene.cameras.main;
  const isMobile = window.innerWidth <= 991;

  if (!isMobile) return;

  // --- movement flags ---
  scene.moveLeft = false;
  scene.moveRight = false;

  // --- helper function для обработки pointerdown/pointerup ---
  const makeButton = (x, y, w, h, color) => {
    const btn = scene.add.rectangle(x, y, w, h, color).setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.setDepth(20);
    return btn;
  };

  // --- left button ---
  const leftBtn = makeButton(60, height - 80, 100, 100, 0x888888);
  leftBtn.on("pointerdown", () => (scene.moveLeft = true));
  leftBtn.on("pointerup", () => (scene.moveLeft = false));
  leftBtn.on("pointerout", () => (scene.moveLeft = false)); // если палец/мышь ушел

  // --- right button ---
  const rightBtn = makeButton(200, height - 80, 100, 100, 0x888888);
  rightBtn.on("pointerdown", () => (scene.moveRight = true));
  rightBtn.on("pointerup", () => (scene.moveRight = false));
  rightBtn.on("pointerout", () => (scene.moveRight = false));

  // --- E button ---
  const eBtn = makeButton(120, height - 220, 120, 120, 0x4444ff);
  eBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-E"));

  // --- big Space button (second row) ---
  const spaceBtn = makeButton(120, height - 380, 250, 100, 0xff4444);
  spaceBtn.on("pointerdown", () => scene.input.keyboard.emit("keydown-SPACE"));
}
