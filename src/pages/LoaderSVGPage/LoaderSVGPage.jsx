/* eslint-disable*/
import React from 'react';

class LoaderSVGPage extends React.PureComponent {
  constructor() {
    super();
    this.preview = null;
  }

  handleLoad = (e) => {
    const { files } = e.target;
    for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.type.startsWith('image/')) {
      const img = document.createElement("img");
      img.classList.add("obj");
      img.file = file;
      this.preview.appendChild(img);
      const reader = new FileReader();
      reader.onload = (
        (aImg) =>
          (e) => {
            aImg.src = e.target.result;
          })(img);
      reader.readAsDataURL(file);
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = images[i].getBoundingClientRect();
      const maxSize = size.width || size.height;
      ctx.width = maxSize;
      ctx.height = maxSize;
      ctx.drawImage(images[i], 0, 0);
      const imageData = ctx.getImageData(0, 0, maxSize, maxSize);
      this.convertToPoints(imageData);
    }
  }

  convertToPoints = (imageData) => {
    const { width, height, data } = imageData;
    const imageCoords = [];
    const size = width || height;
    for(let y = 0; y < size; y++) {
      for(let x = 0; x < size; x++) {
        const red = data[((size * y) + x) * 4];
        const green = data[((size * y) + x) * 4 + 1];
        const blue = data[((size * y) + x) * 4 + 2];
        const alpha = data[((size * y) + x) * 4 + 3];
	        if(alpha>0){
	        	imageCoords.push([(x - size/2), (size/2 - y)]);
	        }
        }
      }
    return imageCoords;
  }

  render() {
    return (
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
        <div ref={(n) => { this.preview = n; }} />
      </form>
    );
  }
}

export default LoaderSVGPage;
