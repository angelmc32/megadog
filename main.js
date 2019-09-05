let control = new Control();
let display = new Display(document.getElementById("canvas"));
let level1 = new Level(1, 3);
let levels = [level1];
let frames = [["./images/gorduki_0.png","./images/gorduki_1.png","./images/gorduki_2.png","./images/gorduki_00.png","./images/gorduki_jump.png"],
              ["./images/gordukip_0.png","./images/gordukip_1.png","./images/gordukip_2.png","./images/gordukip_00.png","./images/gordukip_jump.png"]];
let game = new Game(frames, levels);
game.world.createEnemies();
game.world.createItems();

window.addEventListener("load", function(event) {
  "use strict";

  let keyDownUp = function(event) {
    control.keyDownUp(event.type, event.keyCode);
  };

  document.onkeydown = function(event) {
    if (
      event.keyCode === 32 &&
      game.world.player.attacks.length < 5 &&
      game.world.player.charge < 5
    )
      game.world.player.attack();
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
    display.drawBackground(game.world.player);
    display.drawMap(game.world.map, game.world.columns);
    display.drawEnemies(game.world.enemies);
    display.drawItems(game.world.items);
    display.drawPlayer(game.world.player, game.world.player.xPosition, game.world.player.yPosition, game.world.player.width, game.world.player.height);
    for (let i = 0; i < game.world.player.attacks.length; i++) {
      display.drawImage(
        game.world.player.attacks[i].image,
        game.world.player.attacks[i].xPosition,
        game.world.player.attacks[i].yPosition,
        game.world.player.attacks[i].width,
        game.world.player.attacks[i].height
      );
    }
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
    if (control.space.down) {
      if (!game.world.player.chargedState) {
        game.world.player.charge++;
        if (game.world.player.charge > 89)
          game.world.player.chargedState = true;
      }
    }
    if (game.world.player.chargedState && !control.space.down)
      game.world.player.attack();
    if (!control.space.down) {
      if (game.world.player.charge > 5) game.world.player.attack();
      game.world.player.charge = 0;
    }

    if ( control.one.active ) {
      game.world.player.attackType = 0;
    }
    if ( control.two.active ) {
      game.world.player.attackType = 1;
    }
    if ( control.three.active ) {
      game.world.player.attackType = 2;
    }

    game.update();
  };

  let engine = new Engine(1000 / 50, render, update);

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

  display.tile_sheet.image.src = "./images/world_sprites/map_tiles.png";
  display.background.image.src = "./images/world_sprites/background.png";

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

  resize();

  engine.start();
});
