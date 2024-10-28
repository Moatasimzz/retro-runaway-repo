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
}
function update() {}
