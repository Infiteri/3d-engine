import { glMatrix, mat4 } from "../../src/index.js";
import { gl } from "../Engine.js";

export default class Camera {
  constructor(fov) {
    this.x = 0;
    this.y = 0;
    this.z = -8;

    this.projectionMatrix = mat4.create();

    mat4.perspective(
      this.projectionMatrix,
      glMatrix.toRadian(fov),
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000
    );

    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [
      this.x,
      this.y,
      this.z,
    ]);
  }
}
