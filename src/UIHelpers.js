export function addInterface(scene) {
  if (scene.interfaceImage) {
    scene.interfaceImage.destroy();
  }
  const { width, height } = scene.cameras.main;
  const img = scene.add
    .image(width / 2, height / 2, "interface")
    .setOrigin(0.5)
    .setDisplaySize(width, height);
  img.setDepth(10);
  scene.interfaceImage = img;
  return img;
}

export function addFace(scene, textureKey) {
  if (scene.faceImage) {
    scene.faceImage.destroy();
  }
  const { height } = scene.cameras.main;
  const img = scene.add
    .image(160, height - 162, textureKey)
    .setOrigin(0.5)
    .setDisplaySize(182, 182);
  img.setDepth(8);
  return img;
}

// export function addDialogueText(scene, textContent) {
//   const { width, height } = scene.cameras.main;

//   const text = scene.add.text(width - 50, height - 54, textContent, {
//     fontFamily: "Pixelify Sans",
//     fontSize: "24px",
//     color: "#ffffff",
//     wordWrap: { width: 650, useAdvancedWrap: true },
//     align: "left",
//   });
//   text.setOrigin(1, 1);
//   text.setDepth(12);
//   return text;
// }

export function addDialogueText(scene, textContent) {
  const { width, height } = scene.cameras.main;

  // Fixed boundaries
  const left = 320;
  const top = height - 270;
  const right = width - 46;
  //   const blockHeight = 220; // высота блока (для рамки и ориентирования)

  const textWidth = right - left;

  // Add text
  const text = scene.add.text(left, top, textContent, {
    fontFamily: "Pixelify Sans",
    fontSize: "24px",
    color: "#ffffff",
    wordWrap: { width: textWidth, useAdvancedWrap: true },
    align: "left",
  });
  text.setOrigin(0, 0);
  text.setDepth(12);

  //   // Red border for visualization
  //   const graphics = scene.add.graphics();
  //   graphics.lineStyle(2, 0xff0000, 1);
  //   graphics.strokeRect(left, top, textWidth, blockHeight);
  //   graphics.setDepth(11);

  return text;
}

export function addTaskText(scene, taskContent) {
  const { width } = scene.cameras.main;

  const text = scene.add.text(width / 2, 130, taskContent, {
    fontFamily: "Pixelify Sans",
    fontSize: "28px",
    color: "#ffffff",
  });
  text.setOrigin(0.5);
  text.setDepth(12);
  return text;
}

// this.interfaceImage = addInterface(this, "interface");
// this.faceImage = addFace(this, "tiredFace");
// this.dialogueText = addDialogueText(this, textContent);
// this.taskText = addTaskText(this, "Press SPACE to continue");
