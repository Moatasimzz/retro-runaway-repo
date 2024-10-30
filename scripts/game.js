const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 576,
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

var grid_array = [
  null,
  "./../assets/tilemaps/grid.csv",
  "./../assets/tilemaps/grid02.csv",
];

var grid,
  game,
  player,
  coins,
  cursors,
  layer,
  keys,
  door,
  have_key = false,
  score = 0,
  coin_value = 3,
  key_value = 4,
  end_value = 5; // The value in your CSV that represents a coin

grid = grid_array[level];
game = new Phaser.Game(config);
// levelOne.addEventListener("click",function(){
//   grid = grid_array[level]
//   game = new Phaser.Game(config);
// })

function preload() {
  this.load.image("tiles", "./../assets/images/purple-tile.png");
  this.load.image("car", "./../assets/images/green-car.png");
  this.load.image("door", "./../assets/images/door.png");
  this.load.tilemapCSV("map", grid);
  this.load.image("key", "./../assets/images/key.png");
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
  layer = map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y

  //add player on tile (0,0) in its center

  cursors = this.input.keyboard.createCursorKeys();

  // add coins for user to collect, coins spin so add them as physics grp
  coins = this.physics.add.group();

  // add animation to coins to spin
  this.anims.create({
    key: "spin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 5 }),
    frameRate: 16,
    repeat: -1,
  });

  // place coins and key in tilemap based on their ids
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      var tile = map.getTileAt(x, y);
      if (tile && tile.index === coin_value) {
        var coin = coins.create(x * 32 + 16, y * 32 + 16, "coin");
        coin.play("spin");
      }
      if (tile && tile.index === key_value) {
        key = this.physics.add.image(x * 32 + 16, y * 32 + 16, "key");
      }
      if (tile && tile.index === end_value) {
        door = this.physics.add.image(x * 32 + 16, y * 32 + 16, "door");
      }
    }
  }
  player = this.physics.add.image(32 + 16, 32 + 16, "car");
  player.setCollideWorldBounds(true);

  this.physics.add.overlap(player, coins, collectCoin);
  this.physics.add.overlap(player, key, collectKey);
  this.physics.add.collider(player, door, win);
}
function update() {
  // manage cursors to control player
  if (this.input.keyboard.checkDown(cursors.left, 100)) {
    // get tile that user will move to now
    const tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
    if (tile && tile.index === 2) {
      //  means a block
    } else {
      // move one step left with rotated image
      player.x -= 32;
      player.angle = 180;
    }
  } else if (this.input.keyboard.checkDown(cursors.right, 100)) {
    const tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
    if (tile && tile.index === 2) {
      // means a block
    } else {
      // move one step right with rotated image
      player.x += 32;
      player.angle = 0;
    }
  } else if (this.input.keyboard.checkDown(cursors.up, 100)) {
    const tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
    if (tile && tile.index === 2) {
      // means a block
    } else {
      player.y -= 32;
      player.angle = -90;
    }
  } else if (this.input.keyboard.checkDown(cursors.down, 100)) {
    const tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
    if (tile && tile.index === 2) {
      // means a block
    } else {
      player.y += 32;
      player.angle = 90;
    }
  }
}
function collectCoin(player, coin) {
  // coin physics is disabled and its game object is removed from display
  coin.disableBody(true, true);
  score += 10;
  scoreText.innerHTML = "Score: " + score;
}

function collectKey(player, key) {
  key.disableBody(true, true);
  have_key = true;
}

function win(player, door) {
  if (have_key) {
    game.pause();
    level += 1;
    console.log(level);
    createLevelButton();
  }
}

function loadLevel(level) {
  if (game) {
    game.destroy(true, false);
  }
  grid = grid_array[level];
  game = new Phaser.Game(config);
}

function createLevelButton() {
  var winBtn = document.createElement("button");
  winBtn.setAttribute("id", `${levelsArray[level]}`);
  winBtn.innerHTML = `Level ${level}`;
  winDiv.appendChild(winBtn);
  winBtn.addEventListener("click", function () {
    loadLevel(level);
    winDiv.style.display = "none";
    console.log(level);
    levelHeader.innerHTML = `Level ${level}`;
  });
  winDiv.style.display = "block";
}
