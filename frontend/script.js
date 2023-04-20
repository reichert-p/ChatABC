class Game extends Phaser.Scene
{

  cursors;
  player;
  emitter;

  spacebar;
  lastPressed;

  keys = [];  

preload ()
{
  this.setupKeys()

  this.load.setBaseURL('assets');

  this.load.image('dude', 'character.png');
  //this.load.image('keyboard', 'keyboard.png');
  this.load.image('particle', 'fire.png');

  this.keys.forEach((key) => {
    var name = key+'Key';
    var location = 'Keys/' + key + '-Key.png'
    this.load.spritesheet(name , location, { frameWidth: 32, frameHeight: 32 });
  });

  this.load.spritesheet('ShiftKey', 'Keys/Shift-Key.png', { frameWidth: 48, frameHeight: 32 })
  this.load.spritesheet('SpaceKey', 'Keys/Space-Key.png', { frameWidth: 64, frameHeight: 32 })
  this.load.spritesheet('CoolKey', 'Keys/Cool-Key.png',  { frameWidth: 32, frameHeight: 32 })
}

create ()
{
  //this.add.image(400, 300, 'keyboard')

  var particles = this.add.particles('particle');

  this.emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
  });

  this.player = this.physics.add.sprite(200, 300, 'dude').setOrigin(0);
  this.player.setSize(35, 35);
  this.player.setDisplaySize(35, 35);

  this.player.setBounce(0.8);
  this.player.setCollideWorldBounds(true);
 
  this.cursors = this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.emitter.startFollow(this.player);

  this.createKeyboardLayout()
}

createKeyboardLayout(){
  for (let i = 0; i < 9; i++) {
    this.createSimpleKey(this.keys[i],50 + 71 * i,50)
  }
  this.createSimpleKey(this.keys[36], 50 + 71 * 9, 50)
  this.createSimpleKey(this.keys[35], 50 + 71 * 10, 50)

  this.createSimpleKey(this.keys[25], 50,180)
  this.createSimpleKey(this.keys[31], 50 + 71 * 1, 180)
  this.createSimpleKey(this.keys[13], 50 + 71 * 2, 180)
  this.createSimpleKey(this.keys[26], 50 + 71 * 3, 180)
  this.createSimpleKey(this.keys[28], 50 + 71 * 4, 180)
  this.createSimpleKey(this.keys[34], 50 + 71 * 5, 180)
  this.createSimpleKey(this.keys[29], 50 + 71 * 6, 180)
  this.createSimpleKey(this.keys[17], 50 + 71 * 7, 180)
  this.createSimpleKey(this.keys[23], 50 + 71 * 8, 180)
  this.createSimpleKey(this.keys[24], 50 + 71 * 9, 180)
  this.createSimpleKey(this.keys[37], 50 + 71 * 10, 180) // ü
  

  this.createSimpleKey(this.keys[9], 50,310)
  this.createSimpleKey(this.keys[27], 50 + 71 * 1, 310)
  this.createSimpleKey(this.keys[12], 50 + 71 * 2, 310)
  this.createSimpleKey(this.keys[14], 50 + 71 * 3, 310)
  this.createSimpleKey(this.keys[15], 50 + 71 * 4, 310)
  this.createSimpleKey(this.keys[16], 50 + 71 * 5, 310)
  this.createSimpleKey(this.keys[18], 50 + 71 * 6, 310)
  this.createSimpleKey(this.keys[19], 50 + 71 * 7, 310)
  this.createSimpleKey(this.keys[20], 50 + 71 * 8, 310)
  this.createSimpleKey(this.keys[39], 50 + 71 * 9, 310)  // ö
  this.createSimpleKey(this.keys[38], 50 + 71 * 10, 310)  //ä


  this.createSimpleKey(this.keys[33], 170,440)
  this.createSimpleKey(this.keys[32], 170 + 71 * 1, 440)
  this.createSimpleKey(this.keys[11], 170 + 71 * 2, 440)
  this.createSimpleKey(this.keys[30], 170 + 71 * 3, 440)
  this.createSimpleKey(this.keys[10], 170 + 71 * 4, 440)
  this.createSimpleKey(this.keys[22], 170 + 71 * 5, 440)
  this.createSimpleKey(this.keys[21], 170 + 71 * 6, 440)


  this.createKey('Space', 250 , 510, 120, 50 )
  this.createKey('Shift', 50 , 510, 80, 50 )
  this.createSimpleKey('Cool', 400, 510, 50, 50)
}

createKey(key, xpos, ypos, xsize, ysize){
  var keysprite = this.physics.add.sprite(xpos, ypos, key+'Key')
  keysprite.setSize(xsize, ysize);
  keysprite.setDisplaySize(xsize, ysize);
  keysprite.body.allowGravity = false

  this.anims.create({
    key: key+'Key',
    frames: this.anims.generateFrameNumbers(key+'Key', { start: 1, end: 0 }),
    frameRate: 20,
    repeat: 1
  });

  this.physics.add.overlap(this.player, keysprite, this.hitKey, null, this);
}

createSimpleKey(key, xpos, ypos) {
  this.createKey(key, xpos, ypos, 50, 50)
}

hitKey (player, key)
{
  key.anims.play(key.texture);
  var keyID = key.texture.key;
  this.lastPressed = keyID.slice(0, -3)
}

update() {
  if (this.cursors.left.isDown){
      this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown){
      this.player.setVelocityX(160)
  } else{
      this.player.setVelocityX(0);
  }
  if (this.cursors.up.isDown) {
      this.player.setVelocityY(-330);
  }
  if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
    console.log(this.lastPressed);
  }
 
}

  setupKeys(){
    this.keys.push('1','2','3', '4','5','6','7','8','9')
    this.keys.push('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
    this.keys.push('Esc', '0', 'Ü', 'Ä', 'Ö')
  }
}



const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#d500d5',
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: Game
};

const game = new Phaser.Game(config);

