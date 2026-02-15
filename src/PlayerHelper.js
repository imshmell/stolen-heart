// PlayerHelper.js
export function createPlayer(scene, x, y) {
  // --- create sprite ---
  const player = scene.add
    .sprite(x, y, "player_idle")
    .setOrigin(0.5)
    .setDisplaySize(200, 240)
    .setDepth(7);

  // --- create animations ---
  scene.anims.create({
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

  scene.anims.create({
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

  return player;
}

// --- movement helper ---
export function updatePlayerMovement(player, cursors, speed) {
  if (cursors.left.isDown) {
    player.x -= speed;
    player.flipX = true;
    player.anims.play("walk_left", true);
  } else if (cursors.right.isDown) {
    player.x += speed;
    player.flipX = false;
    player.anims.play("walk_right", true);
  } else {
    player.anims.stop();
    player.setTexture("player_idle");
  }
}
