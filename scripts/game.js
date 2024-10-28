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
function create() {}
function update() {}
