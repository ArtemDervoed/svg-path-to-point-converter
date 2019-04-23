import React from 'react';
import PropTypes from 'prop-types';
import Ball from './Ball';
import Mouse from './Mouse';

class RendererMorph extends React.Component {
  static propTypes = {
    imagesCoord: PropTypes.array.isRequired,
  }
  constructor() {
    super();
    this.canvas = React.createRef();
    this.balls = [];
  }

  componentDidMount() {
    const { imagesCoord } = this.props;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.pos = new Mouse(this.canvas);
    this.mouse = new Ball(0, 0, 20, 'rgba(255,0,255,1)');
    imagesCoord.forEach((path) => {
      this.balls.push(this.pushBalls(path));
    });
    this.animate();
    window.addEventListener('resize', this.handleResize);
  }


  pushBalls = (imagesCoord) => {
    const balls = [];
    imagesCoord.forEach((point) => {
      balls.push(
        new Ball(
          Math.round(point[0]), // eslint-disable-line
          Math.round(point[1]), // eslint-disable-line
        ));
    });
    return balls;
  }

  handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  loadShapesGeometry = () => {
    console.log('shapes loaded');
  }

  connectDots = (dots, ctx) => {
    ctx.beginPath();
    for (let i = 0, jlen = dots.length; i <= jlen; ++i) { // eslint-disable-line
      const p0 = dots[
        i + 0 >= jlen
          ? i + 0 - jlen // eslint-disable-line
          : i + 0
      ];
      const p1 = dots[
        i + 1 >= jlen
          ? i + 1 - jlen // eslint-disable-line
          : i + 1
      ];
      ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    ctx.closePath();
    ctx.stroke();
  }

  connectDots1 = (dots, ctx) => {
    ctx.beginPath();
    ctx.moveTo(dots[0].x, dots[0].y);
    for (let i = 1; i < dots.length; i += 1) { // eslint-disable-line
      ctx.bezierCurveTo(
        dots[i].curve.x1,
        dots[i].curve.y1,
        dots[i].curve.x2,
        dots[i].curve.y2,
        dots[i].x,
        dots[i].y,
      );
    }
    ctx.closePath();
    // ctx.stroke();
    ctx.fill();
  }

  simpleConnectDots = (balls, ctx) => {
    ctx.beginPath();
    ctx.moveTo(balls[0].x, balls[0].y);
    balls.forEach((ball) => {
      ctx.lineTo(ball.x, ball.y);
      // ball.draw(ctx);
    });

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  connectDotsBezier = (dots, ctx) => {
    ctx.beginPath();
    for (let i = 0, jlen = dots.length; i <= jlen; ++i) { // eslint-disable-line
      const p0 = dots[
        i + 0 >= jlen
          ? i + 0 - jlen // eslint-disable-line
          : i + 0
      ];
      const p1 = dots[
        i + 1 >= jlen
          ? i + 1 - jlen // eslint-disable-line
          : i + 1
      ];
      ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    ctx.closePath();
    ctx.fill();
  }

  processingPoints = (pos) => {
    this.balls[0].forEach((ball, i) => {
      ball.think(pos, i);
      ball.draw(this.ctx);
    });
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);
    // this.balls.forEach((balls) => {
    this.processingPoints(this.pos);
    this.connectDotsBezier(this.balls[0], this.ctx);
    // });
    this.mouse.draw(this.ctx);
    requestAnimationFrame(this.animate);
  }

  render() {
    return (<canvas
      ref={
        (node) => { this.canvas = node; }}
    />);
  }
}

export default RendererMorph;
