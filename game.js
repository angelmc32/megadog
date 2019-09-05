class Game {
  constructor(frames, levels) {
    this.world = new World(2, 0.9, frames, levels);
  }

  update() {
    this.world.update();
  }
}

class World {
  constructor(gravity, friction, frames, levels) {
    this.collider = new Collider();
    this.gravity = gravity;
    this.friction = friction;
    this.player = new Player(50, 50, 64, 64, frames);
    this.columns = 10;
    this.rows = 8;
    this.tile_size = 64;
    this.levels = levels;
    this.maps = levels[0].maps;
    this.map = this.maps[0];
    this.currentLevel = 0;
    this.currentStage = 0;
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
    this.bag = new BagMinion(480, 256, 32, 32, frames);
    this.enemies = [];
  }

  createEnemies() {
    let newEnemy, x, y;
    for( let enemyIndex = 0 ; enemyIndex < this.levels[this.currentLevel].enemiesMaps[this.currentLevel].length ; enemyIndex++ ) {
      x = this.levels[this.currentLevel].enemiesMaps[this.currentStage][enemyIndex][1] * this.tile_size;
      y = this.levels[this.currentLevel].enemiesMaps[this.currentStage][enemyIndex][2] * this.tile_size;
      switch ( this.levels[this.currentLevel].enemiesMaps[this.currentStage][enemyIndex][0] ) {
        case "bag": newEnemy = new BagMinion(x, y, 32, 32, frames);
      }
      this.enemies.push(newEnemy);
    }
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
      element.yPosition = 320;
      element.xPosition = 16;
      element.yVelocity = 0;
      element.lives -= 1;
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

  advanceMap() {
    if (this.player.xPosition + 65 > this.width && this.currentStage < this.levels[this.currentLevel].stages ) {
      this.player.xPosition = 0;
      this.currentStage++;
      this.map = this.maps[this.currentStage];
      this.createEnemies();
      this.mapCollisionUpdate(this.map);
    }
  }

  mapCollisionUpdate(array) {
    for ( let index = 0 ; index < array.length ; index++ ) {
      switch ( array[index] ) {
        case 0: this.collision_map[index] = 9; break;
        case 1: this.collision_map[index] = 1; break;
        case 2: this.collision_map[index] = 3; break;
        case 5: this.collision_map[index] = 8; break;
        case 6: this.collision_map[index] = 15; break;
        case 7: this.collision_map[index] = 2; break;
        case 10: this.collision_map[index] = 12; break;
        case 11: this.collision_map[index] = 4; break;
        case 12: this.collision_map[index] = 6; break;
        case 16: this.collision_map[index] = 1; break;
        default: this.collision_map[index] = 0;

      }
    }
  }

  update() {
    for( let i = 0 ; i < this.enemies.length ; i++) this.enemies[i].update();
    this.player.yVelocity += this.gravity;
    this.player.update(this.enemies);
    this.player.xVelocity *= this.friction;
    this.player.yVelocity *= this.friction;

    this.collideElement(this.player);
    this.advanceMap();
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
    if ( element.getLeft() < tile_right /*&& element.getOldLeft() >= tile_right*/ ) {
      console.log("collision");
      element.setLeft(tile_right + 1);
      element.xVelocity = 0;
      return true;
    }
    return false;
  }

  collidePlatformTop(element, tile_top) {
    if (element.getBottom() > tile_top && element.getOldBottom() <= tile_top) {
      element.setBottom(tile_top - 0.1);
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
      case  2: this.collidePlatformRight(element, tile_x + tile_size); console.log(element.getLeft());; break;
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
  constructor(x, y, width, height, frames) {
    this.xPosition = x;
    this.yPosition = y;
    this.xOldPosition = x;
    this.yOldPosition = y;
    this.width = width;
    this.height = height;
    this.frames = frames;
    this.currentFrame = 0;
    this.direction = "L";
    this.speed = 1;
    this.lives = 1;
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

  collide() {
    if (this.xPosition < 0) {
      this.xPosition = 0;
      this.xVelocity = 0;
      this.direction = "R";
    } else if (this.xPosition + this.width > 640) {
      this.xPosition = 640 - this.width;
      this.xVelocity = 0;
      this.direction = "L";
    }
  }

  animate(){
    this.currentFrame++;
    if ( this.currentFrame >= this.frames.length ) this.currentFrame = 0;
    this.image.src = this.frames[this.currentFrame];
  }

  update() {
    if ( this.direction === "L") this.xPosition -= this.speed;
    if ( this.direction === "R") this.xPosition += this.speed;
    this.collide();
    this.animate();
  }

}

class Player extends Element {
  constructor(x, y, width, height, frames) {
    super(x, y, width, height, frames);
    this.lives = 3;
    this.image = new Image();
    this.image.src = this.frames[0][0];
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.charge = 0;
    this.chargedState = false;
    this.attacks = [];
    this.spriteHeight = height - 32;
    this.invincible = false;
    this.invincibleTime = 0;
  }

  getRight()      { return this.xPosition + this.width - 18}
  getTop()        { return this.yPosition + 32 }
  getOldTop()     { return this.yOldPosition + 32 }
  setBottom(y)    { this.yPosition = y - this.height }
  setOldBottom(y) { this.yOldPosition = y - this.height }

  jump() {
    if (!this.jumpState) {
      this.jumpState = true;
      this.yVelocity -= 32;
    }
  }

  moveLeft() {
    this.xVelocity -= 0.5;
  }

  moveRight() {
    this.xVelocity += 0.5;
  }

  animate() {
    if ( this.chargedState ) {
      if ( this.jumpState ) this.image.src = this.frames[1][4];
      else {
        if (this.xVelocity > 0.5 || this.xVelocity < -0.5 ) this.currentFrame++;
        if ( this.currentFrame >= 4 ) this.currentFrame = 0;
        this.image.src = this.frames[1][this.currentFrame];
      }
      if ( this.xVelocity === 0 ) this.image.src = this.frames[1][0];
    } 

    else {
      if ( this.jumpState ) this.image.src = this.frames[0][4];
      else {
        if (this.xVelocity > 0.5 || this.xVelocity < -0.5 ) this.currentFrame++;
        if ( this.currentFrame >= 4 ) this.currentFrame = 0;
        this.image.src = this.frames[0][this.currentFrame];
      }
      if ( this.xVelocity === 0 ) this.image.src = this.frames[0][0];
    }
  }

  collisionCheck(elementsArray) {
    let vectorX, vectorY, halfWidths, halfHeights, offsetX, offsetY;
    
    for (let i = 0; i < elementsArray.length; i++) {
      vectorX = this.xPosition + this.width / 2 - (elementsArray[i].xPosition + elementsArray[i].width / 2);
      vectorY = this.yPosition + this.height / 2 - (elementsArray[i].yPosition + elementsArray[i].height / 2);
      halfWidths = this.width / 2 + elementsArray[i].width / 2;
      halfHeights = this.height / 2 + elementsArray[i].height / 2;

      if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        offsetX = halfWidths - Math.abs(vectorX);
        offsetY = halfHeights - Math.abs(vectorY);

        if (offsetX >= offsetY) {
          if ( vectorY > 0 && !this.invincible ) {
            this.lives -= 1;
            this.invincible = true;
          } else if ( !this.invincible ) {
            this.lives -= 1;
            this.invincible = true;
          }
        } else {
          if ( vectorX > 0 && !this.invincible ) {
            this.lives -= 1;
            this.invincible = true;
          } else if ( !this.invincible ) {
            this.lives -= 1;
            this.invincible = true;
          }
        }
      }
    }
  }

  attack() {
    if (this.charge < 90 && !this.chargedState) {
      let attack = new Attack("./images/32ball.png",this.xPosition + 40,this.yPosition + 24,16,16,12);
      this.attacks.push(attack);
    } else {
      let attack = new Attack("./images/32ball.png",this.xPosition + 16,this.yPosition + 16,48,48,15);
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

  update(enemiesArray) {
    if( this.invincible ) this.invincibleTime++;
    if ( this.invincibleTime > 120 ) {
      this.invincible = false;
      this.invincibleTime = 0;
    }
    this.xPosition += this.xVelocity;
    this.yPosition += this.yVelocity;
    this.animate();
    this.collisionCheck(enemiesArray);
    this.updateAttacks(enemiesArray );
    this.removeAttacks();
  }

  updateAttacks(enemiesArray) {
    for (let i = 0; i < this.attacks.length; i++) {
      this.attacks[i].xPosition += this.attacks[i].xSpeed;
      if ( this.attacks[i].collisionCheck(enemiesArray) ) {
        this.attacks.splice(i,1);
      }
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
  
  collisionCheck(elementsArray) {
    let vectorX, vectorY, halfWidths, halfHeights, offsetX, offsetY;
    
    for (let i = 0; i < elementsArray.length; i++) {
      vectorX = this.xPosition + (this.width - 16) / 2 - (elementsArray[i].xPosition + elementsArray[i].width / 2);
      vectorY = this.yPosition + this.height / 2 - (elementsArray[i].yPosition + elementsArray[i].height / 2);
      halfWidths = this.width / 2 + elementsArray[i].width / 2;
      halfHeights = this.height / 2 + elementsArray[i].height / 2;

      if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        offsetX = halfWidths - Math.abs(vectorX);
        offsetY = halfHeights - Math.abs(vectorY);

        if (offsetX >= offsetY) {
          if ( vectorY > 0 ) {
            elementsArray[i].lives--;
            if ( elementsArray[i].lives <= 0 ) elementsArray.splice(i, 1);
            return true;
          } else {
            elementsArray[i].lives--;
            if ( elementsArray[i].lives <= 0 ) elementsArray.splice(i, 1);
            return true;
          }
        } else {
          if ( vectorX > 0 ) {
            elementsArray[i].lives--;
            if ( elementsArray[i].lives <= 0 ) elementsArray.splice(i, 1);
            return true;
          } else {
            elementsArray[i].lives--;
            if ( elementsArray[i].lives <= 0 ) elementsArray.splice(i, 1);
            return true;
          }
        }
      }
    }
  }
}


class Enemy extends Element {
  constructor(x, y, width, height, frames) {
    super(x, y, width, height, frames);
    this.image = new Image();
    this.image.src = this.frames[0];
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.charge = 0;
    this.chargedState = false;
    this.attacks = [];
    this.spriteHeight = height - 32;
    this.direction = "L"
  }
/*
  animate(){
    this.currentFrame++;
    if ( this.currentFrame >= this.frames.length ) this.currentFrame = 0;
    this.image.src = this.frames[this.currentFrame];
  }

  update() {
    if ( this.direction === "L") this.xPosition--;
    if ( this.direction === "L") this.xPosition++;
    this.collide();
    this.animate();
  }
  */
}

class BagMinion extends Enemy {
  constructor(x, y, width, height, frames) {
    super(x, y, 32, 32, frames);
    this.frames = ["./images/enemies/bag_0.png","./images/enemies/bag_0.png","./images/enemies/bag_1.png","./images/enemies/bag_1.png","./images/enemies/bag_2.png","./images/enemies/bag_2.png",
                   "./images/enemies/bag_1.png","./images/enemies/bag_1.png","./images/enemies/bag_0.png","./images/enemies/bag_0.png","./images/enemies/bag_3.png","./images/enemies/bag_3.png",
                   "./images/enemies/bag_4.png","./images/enemies/bag_4.png","./images/enemies/bag_3.png","./images/enemies/bag_3.png"];
    this.image = new Image();
    this.image.src = this.frames[0];
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.speed = 2;
    this.attacks = [];
    this.spriteHeight = height - 32;
    this.lives = 2;
  }

}

class GremlinMinion extends Enemy {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.image = new Image();
    this.image.src = this.frames[0];
    this.jumpState = true;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.charge = 0;
    this.chargedState = false;
    this.attacks = [];
    this.spriteHeight = height - 32;
  }
}