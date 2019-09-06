

window.addEventListener("load", function(event) {
  "use strict";

  // CLASSES
  class AssetManager {
    constructor() {
      this.successCount = 0;
      this.errorCount = 0;
      this.imagesCache = {};
      this.imagesQueue = ["./images/world_sprites/map_tiles.png","./images/world_sprites/background.png", "./images/gorduki_0.png","./images/gorduki_1.png","./images/gorduki_2.png","./images/gorduki_00.png","./images/gorduki_jump.png","./images/gorduki_sleep.png","./images/gorduki_over.png","./images/gordukip_0.png","./images/gordukip_1.png","./images/gordukip_2.png","./images/gordukip_00.png","./images/gordukip_jump.png","./images/gordukil_0.png","./images/gordukil_1.png","./images/gordukil_2.png","./images/gordukil_00.png","./images/gordukil_jump.png","./images/gordukilp_0.png","./images/gordukilp_1.png","./images/gordukilp_2.png","./images/gordukilp_00.png","./images/gordukilp_jump.png","./images/32ball.png","./images/32water.png","./images/32fire.png","./images/enemies/bag_0.png","./images/enemies/bag_1.png","./images/enemies/bag_2.png","./images/enemies/bag_3.png","./images/enemies/bag_4.png","./images/enemies/gremlin_0.png","./images/enemies/gremlin_1.png","./images/enemies/gremlin_2.png","./images/enemies/gremlin_00.png","./images/enemies/gremlin_01.png","./images/enemies/gremlin_02.png"];
      this.soundsCache = {};
      this.soundsQueue = [];
    }

    imagesQueuePaths(path) {
      this.imagesQueue.push(path);
    }

    soundsQueuePaths(path) {
      this.soundsQueue.push(path);
    }

    downloadImages(downloadCallback) {
      
      if ( this.imagesQueue.length === 0 ) downloadCallback();

      for ( let i = 0 ; i < this.imagesQueue.length ; i++ ) {
        let path = this.imagesQueue[i];
        let img = new Image();
        img.addEventListener("load", () => {
          this.successCount++;
          if ( this.isDone() ) {
            downloadCallback();
          }
        }, false);
        img.addEventListener("error", () => {
          this.errorCount++;
          if ( this.isDone() ) {
            downloadCallback();
          }
        }, false);
        img.src = path;
        this.imagesCache[path] = img;
      }
    }

    isDone() {
      let totalAssets = this.imagesQueue.length + this.soundsQueue.length;
      return ( totalAssets === this.successCount + this.errorCount )
    }

    getImageAsset(path) {
      return this.imagesCache[path];
    }
  }

  // FUNCTIONS

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
        if (game.world.player.charge > 49)
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

  // OBJECTS

  let asset_manager = new AssetManager();
  let control = new Control();
  let display = new Display(document.getElementById("canvas"));
  let level1 = new Level(1);
  let levels = [level1];
  let frames = [];
  let game = new Game(frames, levels);
  game.world.createEnemies();
  game.world.createItems();
  game.world.mapCollisionUpdate(game.world.maps[0]);

  let engine = new Engine(1000 / 50, render, update);

  // INITIALIZE

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;
  display.buffer.imageSmoothingEnabled = false;



  asset_manager.downloadImages(() => {
    display.tile_sheet.image.src = "./images/world_sprites/map_tiles.png";
    display.background.image.src = "./images/world_sprites/background.png";
    
    

    resize();

    engine.start();
  })
/*
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
*/
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

  //resize();

  //engine.start();
});
