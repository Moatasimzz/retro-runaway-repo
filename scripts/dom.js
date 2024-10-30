/*MAIN MENU*/
var playBttn = document.getElementById("play-bttn");
var helpBttn = document.getElementById("help-bttn");
var userName = document.getElementById("username");
var playBttnIW = document.getElementById("play-bttn-IW");
var carsDiv = document.querySelector(".car-imgs-container");
var carTitle = document.getElementById("cars-title");

// game.js dom
var scoreText = document.getElementById("score");
var timeText = document.getElementById("time");
var winDiv = document.getElementById("win");
var loseDiv = document.getElementById("lose");
var endDiv = document.getElementById("end");
var levelHeader = document.getElementById("level");
var winBtn = document.getElementById("winBtn");
var loseBtn = document.getElementById("loseBtn");
var endBtn = document.getElementById("endBtn");

var levelsArray = [null, "level1", "level2", "level3"];
var level = 1; // initial level
