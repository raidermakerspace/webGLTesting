var drop = document.querySelector("#main");

container.addEventListener("mouseclick", function(e) {
  mover.style.backgroundPositionX = -e.offsetX * 1.8 + "px";
  mover.style.backgroundPositionY = -e.offsetY + 80 + "px";
});
