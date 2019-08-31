class Control {
  constructor() {
    this.left = new ButtonInput();
    this.right = new ButtonInput();
    this.up = new ButtonInput();
    this.space = new ButtonInput();
  }

  keyDownUp(type, keyCode) {
    let down = type === "keydown" ? true : false;

    switch (keyCode) {
      case 37:
        this.left.getInput(down);
        break;
      case 38:
        this.up.getInput(down);
        break;
      case 39:
        this.right.getInput(down);
        break;
      /*case 32:
        this.space.getInput(down);
        break;*/
    }
  }
}

class ButtonInput {
  constructor() {
    this.active = false;
    this.down = false;
  }

  getInput(down) {
    if (this.down !== down) this.active = down;
    this.down = down;
  }
}
