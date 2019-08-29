class Engine {
  constructor(fps, update, render) {
    this.accumulated_time = 0;                  // Amount of time accumulated since last update
    this.animation_frame_request = undefined;   // Reference to requestanimationframe method
    this.time = undefined;                      // Most recent timestamp of loop execution
    this.fps = fps;                             // Frames per second
    this.updated = false;                       // Whether or not the update function has been called
    this.update = update;                       // Update function set when class is instanced
    this.render = render;                       // Render function set when class is instanced
  }

  start() {
    this.accumulated_time = this.fps;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleLoop);
  }

  stop() {
    window.cancelAnimationFrame(this.animation_frame_request);
  }

  loop(time_stamp) {
    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    while(this.accumulated_time >= this.fps) {
      this.accumulated_time -= this.fps;
      this.update(time_stamp);
      this.updated = true;
    }

    if (this.updated) {
      this.updated = false;
      this.render(time_stamp)
    }

    this.animation_frame_request = window.requestAnimationFrame(this.handleLoop);
  }

  handleLoop = (fps) => { 
    this.loop(fps);
  }
}