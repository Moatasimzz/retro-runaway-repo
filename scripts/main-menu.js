var carColor = "";
playBttn.addEventListener("click", naviagteLVL01);
helpBttn.addEventListener("click", navigateTutorial);
var buttons = Array.from(carsDiv.children);

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    carColor = button.getAttribute("car-color");
    console.log(carColor);
    carTitle.style.color = "white";
  });
});
userName.addEventListener("input", function () {
  userName.style.borderColor = "#650c76";
});
function naviagteLVL01() {
  var nameInput = userName.value;
  if (nameInput && carColor) {
    window.location.href = `game.html?color=${carColor}`;
  } else if (nameInput) {
    carTitle.style.color = "red";
  } else if (carColor) {
    userName.style.borderColor = "red";
    userName.placeholder = "Please Enter Your Name";
  } else {
    userName.style.borderColor = "red";
    carTitle.style.color = "red";
    userName.placeholder = "Please Enter Your Name";
  }
}

function navigateTutorial() {
  window.location.href = "./../index.html#tutorials";
}
