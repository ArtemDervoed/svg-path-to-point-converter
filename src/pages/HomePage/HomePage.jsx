// /* eslint-disable*/
import React, { Fragment } from 'react';
import RendererMorph from '_components/RendererMorph';

import { svgPathToPoints } from './svgPathToPoints';

class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.preview = null;
    this.state = {
      imagesCoord: [],
      render: false,
    };
  }

  getQuadraticBezierXYatT = (startPt, controlPt, endPt, T) => {
    const x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;// eslint-disable-line
    const y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T,2) * endPt.y;// eslint-disable-line
    return ({ x, y });
  }

  handleLoad = (e) => {
    const { files } = e.target;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const img = document.createElement('object');
        img.classList.add('obj');
        img.file = file;
        this.preview.appendChild(img);
        const reader = new FileReader();
        reader.onload = (
          aImg =>
            () => {
              aImg.data = URL.createObjectURL(file); // eslint-disable-line
              aImg.type = 'image/svg+xml'; // eslint-disable-line
            })(img);
        reader.readAsDataURL(file);
      }
    }
  }

  convertBezierToPoints = (imagesCoord) => {
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
    return points;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const images = this.preview.childNodes;
    const coordianates = [];
    for (let i = 0; i < images.length; i += 1) {
      const svg = images[i].contentDocument.documentElement;
      coordianates.push(this.convertBezierToPoints(svgPathToPoints(svg)));
    }
    this.setState({ imagesCoord: coordianates, render: true });
  }

  render() {
    const { imagesCoord, render } = this.state;
    return (
      <Fragment>
        <form method="post" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="file">
              Choose file to upload
              <input
                onChange={this.handleLoad}
                type="file"
                id="file"
                name="file"
                multiple
              />
            </label>
          </div>
          <div>
            <button>Submit</button>
          </div>
          <div
            ref={(n) => { this.preview = n; }}
            style={{
              visibility: 'hidden',
              position: 'fixed',
            }}
          />
        </form>
        {
          render && <RendererMorph imagesCoord={imagesCoord} />
        }
      </Fragment>
    );
  }
}

export default HomePage;
