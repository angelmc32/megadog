class Game {
  constructor() {
    this.world = new World(2, 0.9);
  }

  update() {
    this.world.update();
  }
}

class World {
  constructor(gravity, friction) {
    this.collider = new Collider();
    this.gravity = gravity;
    this.friction = friction;
    this.player = new Player(50, 50, 64, 64, "./images/gorduki_0.png", "./images/gordukip_0.png");
    this.columns = 10;
    this.rows = 8;
    this.tile_size = 64;
    this.map = [4,4,4,4,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,16,
                4,4,4,4,4,4,3,4,4,4,
                4,4,4,3,4,4,16,4,4,4,
                4,4,4,4,4,4,4,4,4,4,
                1,1,1,1,1,2,4,4,0,1,
                6,6,6,6,6,7,4,4,5,6];
    this.collision_map = [0,0,0,0,0,0,0,0,0,0,
                          0,0,0,0,0,0,0,0,0,0,
                          0,0,0,0,0,0,0,0,0,1,
                          0,0,0,0,0,0,0,0,0,0,
                          0,0,0,0,0,0,1,0,0,0,
                          0,0,0,0,0,0,0,0,0,0,
                          1,1,1,1,1,3,0,0,9,1,
                          0,0,0,0,0,2,0,0,8,0];
    this.height = 512;
    this.width = 640;
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
    } else if (element.yPosition + element.height > this.height) {
      element.jumpState = false;
      element.yPosition = this.height - element.height;
      element.yVelocity = 0;
    }

    let bottom, left, right, top, value;
    
    top    = Math.floor(element.getTop()    / this.tile_size);
    left   = Math.floor(element.getLeft()   / this.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, element, left * this.tile_size, top * this.tile_size, this.tile_size);

    top    = Math.floor(element.getTop()    / this.tile_size);
    right  = Math.floor(element.getRight()  / this.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, element, right * this.tile_size, top * this.tile_size, this.tile_size);

    bottom = Math.floor(element.getBottom() / this.tile_size);
    left   = Math.floor(element.getLeft()   / this.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, element, left * this.tile_size, bottom * this.tile_size, this.tile_size);

    bottom = Math.floor(element.getBottom() / this.tile_size);
    right  = Math.floor(element.getRight()  / this.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, element, right * this.tile_size, bottom * this.tile_size, this.tile_size);
  }

  update() {
    this.player.yVelocity += this.gravity;
    this.player.update();
    this.player.xVelocity *= this.friction;
    this.player.yVelocity *= this.friction;

    this.collideElement(this.player);
  }
}

class Collider {
  constructor(){
    this.name = "collider";
  }

  collidePlatformBottom(element, tile_bottom) {
    if ( element.getTop() < tile_bottom && element.getOldTop() >= tile_bottom ) {
      element.setTop(tile_bottom);
      element.yVelocity = 0;
      return true;
    }
    return false;
  }

  collidePlatformLeft(element, tile_left) {
    if ( element.getRight() > tile_left && element.getOldRight() <= tile_left ) {
      console.log("collision");
      element.setRight(tile_left - 1);
      element.xVelocity = 0;
      return true;
    }
    return false;
  }

  collidePlatformRight(element, tile_right) {
    if ( element.getLeft() < tile_right && element.getOldLeft() >= tile_right ) {
      console.log("collision");
      element.setLeft(tile_right - 1);
      element.xVelocity = 0;
      return true;
    }
    return false;
  }

  collidePlatformTop(element, tile_top) {
    if (element.getBottom() > tile_top && element.getOldBottom() <= tile_top) {
      element.setBottom(tile_top - 1);
      element.yVelocity = 0;
      element.jumpState = false;
      return true;
    }
    return false;
  }

  collide(value, element, tile_x, tile_y, tile_size){
    switch(value) { // value of the tile

      /* All 15 tile types can be described with only 4 collision methods. These
      methods are mixed and matched for each unique tile. */

      case  1: this.collidePlatformTop(element, tile_y); break;
      case  2: this.collidePlatformRight(element, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop(element, tile_y)) return;
               this.collidePlatformRight(element, tile_x + tile_size); break;
      case  4: this.collidePlatformBottom(element, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop(element, tile_y)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight(element, tile_x + tile_size)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop(element, tile_y)) return;
               if (this.collidePlatformRight(element, tile_x + tile_size)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case  8: this.collidePlatformLeft(element, tile_x); break;
      case  9: if (this.collidePlatformTop(element, tile_y)) return;
               this.collidePlatformLeft(element, tile_x); break;
      case 10: if (this.collidePlatformLeft(element, tile_x)) return;
               this.collidePlatformRight(element, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop(element, tile_y)) return;
               if (this.collidePlatformLeft(element, tile_x)) return;
               this.collidePlatformRight(element, tile_x + tile_size); break;
      case 12: if (this.collidePlatformLeft(element, tile_x)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case 13: if (this.collidePlatformTop(element, tile_y)) return;
               if (this.collidePlatformLeft(element, tile_x)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case 14: if (this.collidePlatformLeft(element, tile_x)) return;
               if (this.collidePlatformRight(element, tile_x)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;
      case 15: if (this.collidePlatformTop(element, tile_y)) return;
               if (this.collidePlatformLeft(element, tile_x)) return;
               if (this.collidePlatformRight(element, tile_x + tile_size)) return;
               this.collidePlatformBottom(element, tile_y + tile_size); break;

    }
  }
}

class Element {
  constructor(x, y, width, height) {
    this.xPosition = x;
    this.yPosition = y;
    this.xOldPosition = x;
    this.yOldPosition = y;
    this.width = width;
    this.height = height;
  }

  getBottom()     { return this.yPosition + this.height }
  getLeft()       { return this.xPosition }
  getRight()      { return this.xPosition + this.width }
  getTop()        { return this.yPosition }
  getOldBottom()  { return this.yOldPosition + this.height }
  getOldLeft()    { return this.xOldPosition }
  getOldRight()   { return this.xOldPosition + this.width }
  getOldTop()     { return this.yOldPosition }
  setBottom(y)    { this.yPosition = y - this.height }
  setLeft(x)      { this.xPosition = x }
  setRight(x)     { this.xPosition = x - this.width }
  setTop(y)       { this.yPosition = y }
  setOldBottom(y) { this.yOldPosition = y - this.height }
  setOldLeft(x)   { this.xOldPosition = x }
  setOldRight(x)  { this.xOldPosition = x - this.width }
  setOldTop(y)    { this.yOldPosition = y }

}

class Player extends Element {
  constructor(x, y, width, height, imageSource1, imageSource2) {
    super(x, y, width, height);
    this.image1 = new Image();
    this.image1.src = imageSource1;
    this.image2 = new Image();
    this.image2.src = imageSource2;
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.charge = 0;
    this.chargedState = false;
    this.attacks = [];
  }

  jump() {
    if (!this.jumpState) {
      this.jumpState = true;
      this.yVelocity -= 30;
    }
  }

  moveLeft() {
    this.xVelocity -= 0.9;
  }

  moveRight() {
    this.xVelocity += 0.9;
  }

  attack() {
    if (this.charge < 90 && !this.chargedState) {
      let attack = new Attack(
        "./images/32ball.png",
        this.xPosition + 40,
        this.yPosition + 24,
        16,
        16,
        12
      );
      this.attacks.push(attack);
    } else {
      let attack = new Attack(
        "./images/32ball.png",
        this.xPosition + 16,
        this.yPosition + 16,
        48,
        48,
        15
      );
      this.attacks.push(attack);
      this.charge = 0;
      this.chargedState = false;
      console.log("Descargado :(");
    }
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
    this.updateAttacks();
    this.removeAttacks();
  }

  updateAttacks() {
    for (let i = 0; i < this.attacks.length; i++) {
      this.attacks[i].xPosition += this.attacks[i].xSpeed;
    }
  }
}

class Attack {
  constructor(imageSource, x, y, height, width, xSpeed) {
    this.image = new Image();
    this.image.src = imageSource;
    this.xPosition = x;
    this.yPosition = y;
    this.height = height;
    this.width = width;
    this.xSpeed = xSpeed;
  }
}