let gameScene;
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "gameCanvas",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      //   gravity: { y: 300 },
      debug: false,
    },
  },
  input: {
    keyboard: true, // enable keyboard input
    target: window,
  },
};

const game = new Phaser.Game(config);

function preload() {
  gameScene = this;
  this.load.image("character", "assets/character.png");
  this.load.image("keyboard", "assets/keyboard.png");
}

let character;
let keyboard;

function create() {
  keyboard = this.add.image(400, 300, "keyboard");
  character = this.physics.add.sprite(400, 300, "character");

  gameScene.input.keyboard.on("keydown", function (event) {
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
      const letter = getLetter(character.x, character.y);
      document.getElementById("inputBox").value += letter;
    }
  });
}

function getLetter(x, y) {
  const row = Math.floor((y - 150) / 50);
  const column = Math.floor((x - 170) / 50);
  const letters = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  return letters[row][column];
}

function update() {
  // Move the character based on the user's input
  if (gameScene.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
    character.setVelocityX(-100);
  } else if (
    gameScene.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  ) {
    character.setVelocityX(100);
  } else {
    character.setVelocityX(0);
  }

  if (gameScene.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
    character.setVelocityY(-100);
  } else if (
    gameScene.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.DOWN)
  ) {
    character.setVelocityY(100);
  } else {
    character.setVelocityY(0);
  }

  // Update the character's animation based on its velocity
  if (character.body.velocity.x < 0) {
    character.setFlipX(true);
  } else if (character.body.velocity.x > 0) {
    character.setFlipX(false);
  }

  //   if (character.body.velocity.x !== 0 || character.body.velocity.y !== 0) {
  //     character.anims.play("walk", true);
  //   } else {
  //     character.anims.play("idle", true);
  //   }
}
