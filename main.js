let control = new Control();
let display = new Display(document.getElementById("canvas"));
let game = new Game();

window.addEventListener("load", function(event) {
  "use strict";

  let keyDownUp = function(event) {
    control.keyDownUp(event.type, event.keyCode);
  };

  let resize = function(event) {
    display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      game.world.height / game.world.width
    );
    display.render();
  };

  let render = function() {
    display.fill(game.world.background_color); // Clear background to game's background color.
    display.drawMap(game.world.map, game.world.columns);
    display.drawImage(
      game.world.player.image,
      game.world.player.xPosition,
      game.world.player.yPosition,
      game.world.player.width,
      game.world.player.height
    );
    display.render();
  };

  let update = function() {
    if (control.left.active) {
      game.world.player.moveLeft();
    }
    if (control.right.active) {
      game.world.player.moveRight();
    }
    if (control.up.active) {
      game.world.player.jump();
      control.up.active = false;
    }

    game.update();
  };

  let engine = new Engine(1000 / 60, render, update);

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  display.tile_sheet.image.addEventListener(
    "load",
    function(event) {
      resize();

      engine.start();
    },
    { once: true }
  );

  display.tile_sheet.image.src = "./images/world_sprites/floor.png";

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

  resize();

  engine.start();
});
