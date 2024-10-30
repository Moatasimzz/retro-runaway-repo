playBttn.addEventListener("click", naviagteLVL01);
helpBttn.addEventListener("click", navigateTutorial);

function naviagteLVL01() {
  var nameInput = userName.value;
  if (nameInput) window.location.href = "game.html";
  else {
    userName.style.borderColor = "red";
    userName.placeholder = "Please Enter Your Name";
  }
}

function navigateTutorial() {
  window.location.href = "./../index.html";
}
