import Mesh from "../graphics/Mesh.js";
import { gl } from "../Engine.js";
import BaseGeometry, { AttributeInfo } from "./BaseGeometry.js";

//Shaders
const vsShader = `
    attribute vec4 aVertexPosition;

    void main() {
        gl_Position = aVertexPosition;
    }
`;

const fsShader = `
    void main() {
        gl_FragColor = vec4(1, 1, 1, 1);
    }
`;

export default class TriangleGeometry extends BaseGeometry {
  constructor() {
    super();

    this.vsSource = vsShader;
    this.fsSource = fsShader;

    this.vertexName = "aVertexPosition";
    this.vertexPositionData = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
  }

  /**
   * @param {Mesh} mesh
   */
  BufferAllData(mesh) {
    mesh.BufferData(this.vertexName, this.vertexPositionData);
  }

  /**
   * @param {Mesh} mesh
   */
  AddAttributeInfo(mesh) {
    const positionLocation = mesh.shader.GetAttributeLocation(this.vertexName);

    mesh.AddAttribute(
      new AttributeInfo(positionLocation, 0, 2, this.vertexName)
    );
  }

  Draw() {
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
