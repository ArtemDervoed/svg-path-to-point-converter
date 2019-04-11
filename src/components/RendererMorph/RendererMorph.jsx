import React from 'react';
import * as THREE from 'three';

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} = THREE;

class RendererMorph extends React.Component {
  constructor() {
    super();
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial({ color: 0xffffff });
    this.cube = new Mesh(this.geometry, this.material);
    this.renderer.setSize(this.width, this.height);
    this.scene.add(this.cube);
    this.camera.position.z = 5;

    console.log(this.canvas);
    this.canvas.current.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return <div ref={this.canvas} />;
  }
}

export default RendererMorph;
