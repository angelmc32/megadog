class Display {
  constructor(canvas) {
    this.buffer = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");
    this.tile_sheet = new TileSheet(64, 5, 5);
    this.background = new Background(510, 5, 7, 640, 532, 1548, 1332);
    this.win = new ImageWinLose("./images/world_sprites/win.png",450,300);
    this.lose = new ImageWinLose("./images/world_sprites/lose.png",320,320);
  }

  drawBackground(player) {
    this.buffer.drawImage(this.background.image, this.background.currentX, this.background.yCoordinate, this.background.tile_size, 425, 0, 0, this.background.width, this.background.height);
    this.buffer.drawImage(this.background.image, this.background.xCoordinate, this.background.yCoordinate, this.background.tile_size, 425, this.background.currentX+this.background.width, 0, this.background.width, this.background.height);  
    this.buffer.fillStyle = "#b5b5b5";
    this.buffer.fillRect(0,0,640,32);
    let lives = player.lives;
    let x = 194, y = 2;
    
    for ( let i = 0 ; i < lives ; i++ ) {
      let source_x = this.tile_sheet.tile_size * 4;
      let source_y = this.tile_sheet.tile_size * 4;
      let destination_x = (32*i)+16
      this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, 32, 32, destination_x, 0, 32, 32);
    }
    // Paint ball attack, source_x = 288 source_y = 256 destination_x = 192
    this.buffer.drawImage(this.tile_sheet.image, 288, 256, 32, 32, 192, 0, 32, 32);
    // Paint water attack, source_x = 256 source_y = 288 destination_x = 224
    this.buffer.drawImage(this.tile_sheet.image, 256, 288, 32, 32, 224, 0, 32, 32);
    // Paint fire attack, source_x = 288 source_y = 288 destination_x = 256
    this.buffer.drawImage(this.tile_sheet.image, 288, 288, 32, 32, 256, 0, 32, 32);

    switch(player.attackType) {
      case 0: x = 194; break;
      case 1: x = 226; break;
      case 2: x = 258; break;
    }
    this.buffer.beginPath();
    this.buffer.lineWidth = "2";
    this.buffer.strokeStyle = "red";
    this.buffer.rect(x, y, 28, 28); 
    this.buffer.stroke();
  }

  drawMap(map, columns) {
    for (let index = 0; index < map.length; index++) {
      let value = map[index];
      let source_x = (value % this.tile_sheet.columns) * this.tile_sheet.tile_size;
      let source_y = Math.floor(value / this.tile_sheet.columns) * this.tile_sheet.tile_size;
      let destination_x = (index % columns) * 64;
      let destination_y = Math.floor(index / columns) * 64;

      this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size, destination_x, destination_y, 64, 64);
    }
  }

  drawImage(image, x, y, width, height) {
    this.buffer.drawImage(image, Math.round(x), Math.round(y), width, height);
  }

  drawPlayer(player, x, y, width, height) {
    let points = player.points;
    this.buffer.font = "16px Arial";
    this.buffer.strokeText(`p o i n t s : ${points}`, 448,22);
    this.buffer.drawImage(player.image, Math.round(x), Math.round(y), width, height);
    if (player.lives <= 0) {
      this.buffer.strokeText(`g a m e  o v e r`, 16,22);
      this.buffer.drawImage(this.lose.image,160,16,320,320);
      return false;
    }
    if ( player.winCondition ) {
      this.buffer.drawImage(this.win.image, 100,32, 450, 300);
    }
  }

  drawEnemies(enemiesArray) {
    for (let i = 0 ; i < enemiesArray.length ; i++) {
      this.buffer.drawImage(enemiesArray[i].image, enemiesArray[i].xPosition, enemiesArray[i].yPosition, enemiesArray[i].width, enemiesArray[i].height);
    }
  }

  drawItems(itemsArray) {
    for (let i = 0 ; i < itemsArray.length ; i++) {
      let source_x = ((itemsArray[i].location % this.tile_sheet.columns) * this.tile_sheet.tile_size);
      let source_y = (Math.floor(itemsArray[i].location / this.tile_sheet.columns) * this.tile_sheet.tile_size) - 1;
      let destination_x = itemsArray[i].xPosition;
      let destination_y = itemsArray[i].yPosition;

      this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, 64, 64, destination_x, destination_y, 64,64);

      //this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size, destination_x, destination_y, 64, 64);
    }
  }

  fill(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  }

  render() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  resize(width, height, heightWidthRatio) {
    if (height / width > heightWidthRatio) {
      this.context.canvas.height = width * heightWidthRatio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / heightWidthRatio;
    }
    this.context.imageSmoothingEnabled = false;
  }
}

class ImageWinLose {
  constructor(imageSource, width, height){
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSource;
  }
}

class TileSheet {
  constructor(tile_size, columns, rows) {
    this.image = new Image();
    this.tile_size = tile_size;
    this.columns = columns;
    this.rows = rows;
  }
}

class Background extends TileSheet {
  constructor(tile_size, columns, rows, canvasWidth, canvasHeight, xCoordinate, yCoordinate) {
    super(tile_size, columns, rows);
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.xCoordinate = xCoordinate; // Sets the x position in the tile sheet to "select" background
    this.yCoordinate = yCoordinate; // Sets the y position in the tile sheet to "select" background
    this.currentX = xCoordinate;
    this.start = 0;
    this.end = 640*5;
  }
}
