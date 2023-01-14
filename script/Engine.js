import Camera from "./code/Camera.js";

export const gl = document.querySelector("canvas").getContext("webgl");

export default class Engine {
  constructor() {
    this.canvas = document.querySelector("canvas");

    this.elements = [];

    //BLACK
    gl.clearColor(0, 0, 0, 1);
  }

  AddMesh(element) {
    this.elements.push(element);
  }

  /**
   * @param {Camera} camera
   */
  Render(camera) {
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw all the elements
    this.elements.forEach(e => {
      e.Draw(camera);
    });
  }
}
