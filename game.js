class Game {
  constructor() {
    this.world = new World(2, 0.9);
  }
  /*{
      background_color: "#808080",
      friction: 0.9,
      gravity: 2,
      player: new Player(50, 50, "./images/gorduki_0.png"),
      height: 640,
      width: 1024,

      collideElement: function(element) {
        if ( element.xPosition < 0 ) {
          element.xPosition = 0;
          element.xVelocity = 0;
        }
        else if ( element.xPosition + element.width > this.width ) {
          element.xPosition = this.width - element.width;
          element.xVelocity = 0;
        }
    
        if ( element.yPosition < 0 ) {
          element.yPosition = 0;
          element.yVelocity = 0;
        }
        else if ( element.yPosition + element.height > this.height ) {
          element.jumpState = false;
          element.yPosition = this.height - element.height;
          element.yVelocity = 0;
        }
      },
    
      update: function() {
        this.player.yVelocity += this.gravity;
        this.player.update();
        this.player.xVelocity *= this.friction;
        this.player.yVelocity *= this.friction;
    
        this.collideElement(this.player);
      },
    }
  };*/

  update() {
    this.world.update();
  }
}

class World {
  constructor(gravity, friction) {
    this.background_color = "#808080";
    this.gravity = gravity;
    this.friction = friction;
    this.player = new Player(50, 50, "./images/gorduki_0.png");
    this.columns = 16;
    this.rows = 10;
    this.tile_size = 64;
    this.map = [
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      909,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      273,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326,
      326
    ];
    this.height = 640;
    this.width = 1024;
  }

  collideElement(element) {
    if (element.xPosition < 0) {
      element.xPosition = 0;
      element.xVelocity = 0;
    } else if (element.xPosition + element.width > this.width) {
      element.xPosition = this.width - element.width;
      element.xVelocity = 0;
    }

    if (element.yPosition < 0) {
      element.yPosition = 0;
      element.yVelocity = 0;
    } else if (element.yPosition + element.height > this.height - 95) {
      element.jumpState = false;
      element.yPosition = this.height - element.height - 95;
      element.yVelocity = 0;
    }
  }

  update() {
    this.player.yVelocity += this.gravity;
    this.player.update();
    this.player.xVelocity *= this.friction;
    this.player.yVelocity *= this.friction;

    this.collideElement(this.player);
  }
}

class Player {
  constructor(x, y, imageSource) {
    this.image = new Image();
    this.image.src = imageSource;
    this.color = "#ff0000";
    this.xPosition = x;
    this.yPosition = y;
    this.width = 64;
    this.height = 64;
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.attacks = [];
  }

  jump() {
    if (!this.jumpState) {
      this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);

      if (this.color.length !== 7) {
        this.color = this.color.slice(0, 1) + "0" + this.color.slice(1, 6);
      }

      this.jumpState = true;
      this.yVelocity -= 32;
    }
  }

  moveLeft() {
    this.xVelocity -= 2;
  }

  moveRight() {
    this.xVelocity += 2;
  }

  attack() {
    let attack = new Attack(
      "./images/32ball.png",
      this.xPosition + 80,
      this.yPosition + 64,
      32,
      32,
      10
    );
    this.attacks.push(attack);
  }

  removeAttacks() {
    let filtered = this.attacks.filter(function(element, index, array) {
      return element.xPosition < 1024;
    });
    this.attacks = filtered;
  }

  update() {
    this.xPosition += this.xVelocity;
    this.yPosition += this.yVelocity;
  }
}

/*
this.map = [49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,
                49,18,18,18,50,49,19,20,17,18,36,37,11,40,40,40,17,19,40,32,32,32,40,08,11,32,40,32,32,32,40,13,06,06,29,02,00,00,00,00,11,40,40,40,17,19,40,32,32,32,40,08,11,40,40,40,17,19,40,32,32,32,40,08,];
*/
