import { mat4 } from "../../src/index.js";
import Camera from "../code/Camera.js";
import { gl } from "../Engine.js";
import Mesh from "../graphics/Mesh.js";

export class AttributeInfo {
  constructor(location, offset, size, bufferName) {
    this.location = location;
    this.offset = offset;
    this.size = size;
    this.bufferName = bufferName;
  }
}

export default class BaseGeometry {
  constructor() {
    this.vsSource = ``;
    this.fsSource = ``;

    this.vertexName = "";
    this.vertexPositionData = [];

    this.indicesName = "";
    this.indices = [];

    this.normalsName = "";
    this.normals = [];

    this.faceColors = [];
    this.colorsName = "";
    this.colors = [];
  }

  /**
   * @param {Mesh} mesh
   * @param {Camera} camera
   */
  SetUniform(mesh, camera, model) {
    gl.uniformMatrix4fv(
      mesh.locations.uProjectionMatrix,
      false,
      camera.projectionMatrix
    );

    gl.uniformMatrix4fv(
      mesh.locations.uModelViewMatrix,
      false,
      camera.projectionMatrix
    );

    mat4.setPosition(model, 0, 0, camera.z);
  }

  /**
   * @param {Mesh} mesh
   */
  BufferAllData(mesh) {}

  /**
   * @param {Mesh} mesh
   */
  AddAttributeInfo(mesh) {}

  Draw() {}
}
