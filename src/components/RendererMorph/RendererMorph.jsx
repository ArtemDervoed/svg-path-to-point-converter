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
    this.mouse = new Ball(0, 0, 50, 'rgba(0,0,0,0)');
    imagesCoord.forEach((path) => {
      this.balls.push(this.pushBalls(path));
    });
    this.animate();
    window.addEventListener('resize', this.handleResize);
  }

  getQuadraticBezierXYatT = (startPt, controlPt, endPt, T) => {
    const x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;// eslint-disable-line
    const y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T,2) * endPt.y;// eslint-disable-line
    return ({ x, y });
  }

  pushBalls = (imagesCoord) => {
    const balls = [];
    const points = [];
    for (let i = 0; i < imagesCoord.length; i += 1) {
      if (i === 0) {
        points.push({ x: imagesCoord[i].x, y: imagesCoord[i].y });
      } else {
        for (let j = 0; j < 50; j += 1) {
          points.push(this.getQuadraticBezierXYatT(
            { x: imagesCoord[i].curve.x1, y: imagesCoord[i].curve.y1 },
            { x: imagesCoord[i].curve.x2, y: imagesCoord[i].curve.y2 },
            { x: imagesCoord[i].x, y: imagesCoord[i].y },
            j / 50,
          ));
        }
      }
    }
    console.log(points);
    imagesCoord.forEach((point) => {
      if (point.curve) {
        balls.push(
          new Ball(
            Math.round(point.x), // eslint-disable-line
            Math.round(point.y), // eslint-disable-line
            point.curve,
          ));
      } else {
        balls.push(
          new Ball(
            Math.round(point.x), // eslint-disable-line
            Math.round(point.y), // eslint-disable-line
          ));
      }
    });
    console.log(balls);
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

  processingPoints = (pos) => {
    this.balls[0].forEach((ball, i) => {
      ball.think(pos, i * 0);
    });
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);
    this.balls.forEach((balls) => {
      this.processingPoints(this.pos);
      this.connectDots(balls, this.ctx);
    });
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
