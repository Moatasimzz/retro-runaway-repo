var scoreText = document.getElementById("score");
var levelOne = document.getElementById("level1");
var levelTwo = document.getElementById("level2");
var win_div = document.getElementById("win");

var array = [null, "level1", "level2", "level3"];
var level = 1;

function createLevelButton() {
  var win_btn = document.createElement("button");
  win_btn.setAttribute("id", `${array[level]}`);
  win_div.appendChild(win_btn);
  win_div.style.display = "block";
}
