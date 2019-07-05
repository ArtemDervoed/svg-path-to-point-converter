import React from 'react';
import PropTypes from 'prop-types';
import Ball from './Ball';
import Mouse from './Mouse';
import SimplexNoise from 'simplex-noise';
import { TimelineMax } from 'gsap';

class RendererMorph extends React.Component {
  static propTypes = {
    imagesCoord: PropTypes.array.isRequired,
  }

  constructor() {
    super();
    this.canvas = React.createRef();
    this.balls = [];
    this.simplex = new SimplexNoise();
    this.time = 0;
    this.mfX = 1;
    this.mfY = 1;
    this.koef = null;
    this.offset = 0;
  }

  componentDidMount() {
    const { imagesCoord } = this.props;
    console.log(imagesCoord);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centers = [];
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.pos = new Mouse(this.canvas);
    this.mouse = new Ball(0, 0, 20, 'rgba(255,0,255,1)');
    imagesCoord.forEach((path) => {
      this.balls.push(this.pushBalls(path));
    });
    this.centers = this.balls.map(ball => this.getCenter(ball));
    this.animate();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps({ imagesCoord: nextImagesCoord }) {
    const { imagesCoord } = this.props;
    if (nextImagesCoord.length !== imagesCoord.length) {
      nextImagesCoord.forEach((path) => {
        this.balls.push(this.pushBalls(path));
      });
    }
  }

  getCenter = (balls) => {
    let count = 0;
    let allx = 0;
    let ally = 0;
    const seg = balls;
    for (let i = 0; i < seg.length; i += 1) {
      allx += seg[i].x;
      ally += seg[i].y;
      count += 1;
    }
    return {
      x: allx / count,
      y: ally / count,
    };
  }

  changeFigureTo = () => {
    this.balls.forEach((list, i) => {
      list.forEach((ball, j) => {
        new TimelineMax().to(ball.x, 5, this.props.imagesCoord[i][j][0]);
        new TimelineMax().to(ball.y, 5, this.props.imagesCoord[i][j][1]);
      });
    });
  }


  pushBalls = (imagesCoord) => {
    const balls = [];
    imagesCoord.forEach((points) => {
      points.forEach((point) => {
        balls.push(
          new Ball(
            Math.round(point[0] + this.offset), // eslint-disable-line
            Math.round(point[1] + this.offset), // eslint-disable-line
          ));
      });
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
    // this.mfX += 0.005 * ((pos.x / this.centers[0].x) - this.mfX);
    // this.mfY += 0.005 * ((pos.y / this.centers[0].y) - this.mfY);
    this.balls.forEach((ball) => {
      ball.forEach((point) => {
        point.think(pos);
        point.draw(this.ctx);
        // const { originalX, originalY } = point;
        // // const koef = this.time * 0.003;
        // // const noise =
        // //   Math.abs(this.simplex.noise2D(
        // //     ((originalX / 2) + koef),
        // //     ((originalY / 2) + koef),
        // //   ));
        // let newX = (originalX * this.mfX);
        // let newY = (originalY * this.mfY);
        // if (this.centers[0].x - originalX >= 0) {
        //   newX = (originalX * (this.mfX / 2));
        // }
        // if (this.centers[0].x - originalX < 0) {
        //   newX = (originalX * (this.mfX / 2));
        // }
        // if (this.centers[0].y - originalY >= 0) {
        //   newY = (originalY * (this.mfY / 2));
        // }
        // if (this.centers[0].y - originalY < 0) {
        //   newY = (originalY * (this.mfY / 2));
        // }
        // point.setPos(newX, newY);
        // point.originalX = newX// eslint-disable-line
        // point.originalY = newY// eslint-disable-line
      });
    });
  }

  animate = () => {
    // console.log(this.nextImagesCoord[0][0]);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);
    this.balls.forEach((ball) => {
      this.processingPoints(this.pos);
      this.connectDotsBezier(ball, this.ctx);
    });
    this.mouse.draw(this.ctx);
    this.time += 1;
    requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.changeFigureTo}>Next</button>
        <canvas
          ref={
            (node) => { this.canvas = node; }}
        />
      </React.Fragment>
    );
  }
}

export default RendererMorph;
