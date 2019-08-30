class Game {
  constructor() {
    this.world = {
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
  };

  update() {
    this.world.update();
  };
};

class Player {
  constructor(x, y, imageSource) {
    this.image = new Image()
    this.image.src = imageSource;
    this.color = "#ff0000";
    this.xPosition = x;
    this.yPosition = y;
    this.width = 64;
    this.height = 64;
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
  }

  jump() {
    if ( !this.jumpState ) {
      this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);

      if ( this.color.length !== 7 ) {
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

  update() {
    this.xPosition += this.xVelocity;
    this.yPosition += this.yVelocity;
  }
};