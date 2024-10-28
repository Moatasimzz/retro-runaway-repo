const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: "phaser-example",
  pixelArt: true,
  backgroundColor: "#650c76",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "./../assets/images/grey-tile.png");
  this.load.image("car", "./../assets/images/red-car.png");
  this.load.tilemapCSV("map", "./../assets/tilemaps/grid.csv");
  this.load.spritesheet("coin", "./../assets/images/coin.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
}
function create() {
  // create a tilemap where each tile is 32*32 px from map created from csv file
  const map = this.make.tilemap({
    key: "map",
    tileWidth: 32,
    tileHeight: 32,
  });

  // add tileset image of 32*32 px tile where tile 0 is transparent, 1 is blank tile, 2 is shadowed tile
  const tileset = map.addTilesetImage("tiles", null, 32, 32, 1, 2);

  // create layer that will draw maze from added tileset
  this.layer = map.createLayer(0, tileset, 0, 0);

  //add player on tile (0,0) in its center
  this.player = this.add.image(32 + 16, 32 + 16, "car");
  this.cursors = this.input.keyboard.createCursorKeys();

  // add coins for user to collect, coins spin so add them as physics grp
  const coinGroup = this.physics.add.group();
  const coinValue = 3; // The value in your CSV that represents a coin

  // add animation to coins to spin
  this.anims.create({
    key: "spin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 5 }),
    frameRate: 16,
    repeat: -1,
  });

  // place coin in tilemap based on their id = 3
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      var tile = map.getTileAt(x, y);
      if (tile && tile.index === coinValue) {
        var coin = coinGroup.create(x * 32 + 16, y * 32 + 16, "coin");
        coin.play("spin");
      }
    }
  }
}
function update() {
  // manage cursors to control player
  if (this.input.keyboard.checkDown(this.cursors.left, 100)) {
    // get tile that user will move to now
    const tile = this.layer.getTileAtWorldXY(
      this.player.x - 32,
      this.player.y,
      true
    );
    if (tile.index === 2) {
      //  means a block
    } else {
      // move one step left with rotated image
      this.player.x -= 32;
      this.player.angle = 180;
    }
  } else if (this.input.keyboard.checkDown(this.cursors.right, 100)) {
    const tile = this.layer.getTileAtWorldXY(
      this.player.x + 32,
      this.player.y,
      true
    );
    if (tile.index === 2) {
      // means a block
    } else {
      // move one step right with rotated image
      this.player.x += 32;
      this.player.angle = 0;
    }
  } else if (this.input.keyboard.checkDown(this.cursors.up, 100)) {
    const tile = this.layer.getTileAtWorldXY(
      this.player.x,
      this.player.y - 32,
      true
    );
    if (tile.index === 2) {
      // means a block
    } else {
      this.player.y -= 32;
      this.player.angle = -90;
    }
  } else if (this.input.keyboard.checkDown(this.cursors.down, 100)) {
    const tile = this.layer.getTileAtWorldXY(
      this.player.x,
      this.player.y + 32,
      true
    );
    if (tile.index === 2) {
      // means a block
    } else {
      this.player.y += 32;
      this.player.angle = 90;
    }
  }
}
