const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 576,
  parent: "phaser-example",
  pixelArt: true,
  backgroundColor: "#222222",
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

var carColorToImg = {
  pink: "./../assets/images/pink-car.png",
  green: "./../assets/images/green-car.png",
  yellow: "./../assets/images/yellow-car.png",
};

//change grids according to level
var grid_array = [
  null,
  "./../assets/tilemaps/grid.csv",
  "./../assets/tilemaps/grid02.csv",
  "./../assets/tilemaps/grid03.csv",
];

var urlParams = new URLSearchParams(window.location.search);
var carColor = urlParams.get("color");
var grid,
  game,
  player,
  coins,
  cursors,
  layer,
  keys,
  door,
  have_key = false, // need to be changed with levels
  score = 0, // can be changed with levels
  coin_value = 3, // The value in your CSV that represents a coin
  key_value = 4, // The value in your CSV that represents a key
  end_value = 5; // The value in your CSV that represents a door

var level = 1; // initial level

//Start at level 1
grid = grid_array[level];
game = new Phaser.Game(config);

let timeInterval;
var time = [0, 30, 20, 35];
startTimer();

function preload() {
  this.load.image("tiles", "./../assets/images/purple-tile.png");
  this.load.image("car", carColorToImg[carColor]);
  this.load.image("door", "./../assets/images/door-32px.png");
  this.load.image("key", "./../assets/images/key.png");
  this.load.tilemapCSV("map", grid);
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
  //add player on tile (0,0) in its center
  player = this.physics.add.image(32 + 16, 32 + 16, "car");

  // prevent player from going out of canvas
  player.setCollideWorldBounds(true);

  //check collision between player and coin
  this.physics.add.overlap(player, coins, collectCoin);
  //check collision between player and key
  this.physics.add.overlap(player, key, collectKey);
  //check collision between player and door
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
  // add score by 10 and display
  score += 10;
  scoreText.innerHTML = "Score: " + score;
}

function collectKey(player, key) {
  // game object is removed from display
  key.disableBody(true, true);
  have_key = true; // player has collected key
}

function win(player, door) {
  if (have_key) {
    game.pause(); // pause all game so user cannot continue playing
    level += 1;
    have_key = false; // reset key

    if (level <= 3) {
      createNextLevelButtonInWin(); // there is still a next level
    } else {
      // finished game
      finishAllLevels();
    }
  }
}

// choose grid based on level and display
function loadLevel(level) {
  if (game) {
    game.destroy(true, false);
  }
  // LEVELS: any variable game settings between levels are changed here
  score = 0;
  scoreText.innerHTML = "Score: " + score;
  grid = grid_array[level];
  game = new Phaser.Game(config);
  startTimer();
}

// Win Case: Display a message to go to next level
function createNextLevelButtonInWin() {
  stopTimer();
  winBtn.innerHTML = `Level ${level}`;
  winDiv.appendChild(winBtn);
  winDiv.style.display = "block";

  winBtn.addEventListener("click", function () {
    loadLevel(level);
    winDiv.style.display = "none";
    levelHeader.innerHTML = `Level ${level}`;
  });
}

// lose Case: Display a message to go to next level
function manageTryAgainButtonInLose() {
  game.pause();
  loseDiv.style.display = "block";
}

loseBtn.addEventListener("click", function () {
  // LOSE reset settings of game
  resetLevel();
  loseDiv.style.display = "none";
});

function finishAllLevels() {
  endBtn.addEventListener("click", function () {
    // navigate to another page when levels are finished
    window.location.href = "./../pages/mainMenu.html";
  });
  game.pause();
  endDiv.style.display = "block";
}

function resetLevel() {
  time = [0, 5, 120, 90];
  loadLevel(level);
}

function startTimer() {
  timeInterval = setInterval(updateTime, 1000);
  console.log("Timer started");
}

function stopTimer() {
  clearInterval(timeInterval);
}

// add timer
function updateTime() {
  if (time[level] > 0) {
    console.log(time[level]);
    time[level] -= 1;
    timeText.innerText = `Time: ${formatTime(time[level])}`;
  } else {
    stopTimer();
    console.log("lost");
    manageTryAgainButtonInLose();
  }
}

// format time on screen
function formatTime(num) {
  var min = Math.floor(num / 60);
  var sec = Math.floor(num % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
}
