class Display {
  constructor(canvas) {
    this.buffer = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");
    this.tile_sheet = new TileSheet(64, 5, 5);
    this.background = new Background(510, 5, 7, 640, 532, 1548, 1332);
  }

  drawBackground(player) {
    /*
    if ( player.xPosition + 65 > this.background.width) {
      player.xPosition = 0
      this.background.xCoordinate -= 515;
      this.background.currentX = this.background.xCoordinate;
      console.log("avanza");
    }*/
    this.buffer.drawImage(this.background.image, this.background.currentX, this.background.yCoordinate, this.background.tile_size, 425, 0, 0, this.background.width, this.background.height);
    /*
    if ( this.background.currentX > this.background.width ) {
      this.background.currentX  = this.background.xCoordinate;
    }*/
    this.buffer.drawImage(this.background.image, this.background.xCoordinate, this.background.yCoordinate, this.background.tile_size, 425, this.background.currentX+this.background.width, 0, this.background.width, this.background.height);
    
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
    //this.buffer.fillStyle = color;
    this.buffer.drawImage(image, Math.round(x), Math.round(y), width, height);
  }

  drawPlayer(player, x, y, width, height) {
    /*if (player.chargedState)
      this.buffer.drawImage(player.image2, Math.round(x), Math.round(y), width, height);
    else */
      this.buffer.drawImage(player.image, Math.round(x), Math.round(y), width, height);
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
