const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: "phaser-example",
  pixelArt: true,
  backgroundColor: "#4c0d8b",
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
