// /* eslint-disable*/
import React, { Fragment } from 'react';
import RendererMorph from '_components/RendererMorph';

// import { svgPathToPoints } from './svgPathToPoints';
// import { pathDataToPolys } from 'svg-path-to-polygons';

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

  getPoints = (path) => {
    const points = [];
    for (let i = 0; i < 100; i += 1) {
      const point = path.getPointAtLength((i / 100) * path.getTotalLength());
      points.push([point.x, point.y]);
    }
    const center = this.getCenter(points);
    const shiftedPoints = this.setOffsetFigure(points, center);
    return shiftedPoints;
  }

  getCenter = (points) => {
    let count = 0;
    let allx = 0;
    let ally = 0;
    for (let i = 0; i < points.length; i += 1) {
      allx += points[i][0];
      ally += points[i][1];
      count += 1;
    }
    return {
      x: allx / count,
      y: ally / count,
    };
  }

  setOffsetFigure = (points, center) => {
    const newPoints = points.map(point =>
      [
        point[0] - center.x,
        point[1] - center.y,
      ],
    );
    return newPoints;
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

  handleNextForm = () => {
    console.log(RendererMorph.nextForm());
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const images = this.preview.childNodes;
    const coordianates = [];
    for (let i = 0; i < images.length; i += 1) {
      const svg = images[i].contentDocument.documentElement;
      for (let j = 0; j < svg.childNodes.length; j += 1) {
        if (svg.childNodes[j].tagName && svg.childNodes[j].tagName === 'path') {
          coordianates.push([this.getPoints(svg.childNodes[j])]);
        }
      }
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
