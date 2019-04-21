// import { arrayToMatrix, inPoly } from '_utils';

export default class Ball {
  constructor(x, y, curve, radius, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.curve = curve || {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
    this.index = 0;
    this.originalX = x || 0;
    this.originalY = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius || 2;
    this.color = color || '#ff6600';
    this.friction = 0.3;
    this.springFactor = 0.5;
    this.interactionDist = 200;
    this.neighbours = [];
  }

  setPos = (x, y) => {
    this.x = x;
    this.y = y;
  }

  setOldPos = (x, y) => {
    this.originalX = x;
    this.originalY = y;
  }

  setNeighbours = (points) => {
    this.neighbours = points;
  }

  think = (mouse, delta) => {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    const dist = Math.sqrt((dx * dx) + (dy * dy));
    // interaction
    if (dist < this.interactionDist + delta) {
      const angle = Math.atan2(dy, dx);
      const tx = mouse.x + (Math.cos(angle) * (this.interactionDist + delta));
      const ty = mouse.y + (Math.sin(angle) * (this.interactionDist + delta));

      this.vx += tx - this.x;
      this.vy += ty - this.y;

      // spring back
      const dx1 = -(this.x - this.originalX);
      const dy1 = -(this.y - this.originalY);

      this.vx += dx1 * this.springFactor;
      this.vy += dy1 * this.springFactor;

      // friction
      this.vx *= this.friction;
      this.vy *= this.friction;

      // actual move
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
