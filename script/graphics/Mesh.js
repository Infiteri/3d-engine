import { mat4 } from "../../src/index.js";
import Camera from "../code/Camera.js";
import { gl } from "../Engine.js";
import BoxGeometry from "../geometry/BoxGeometry.js";
import BasicMaterial from "../material/BasicMaterial.js";
import Shader from "./Shader.js";

export default class Mesh {
  constructor({
    geometry = new BoxGeometry(),
    material = new BasicMaterial(),
  }) {
    this.material = material;
    this.geometry = geometry;
    this.geometry.Bind(this, this.material);

    this.material.SetTypeIfTexture(this.geometry.texture);

    this.shader = new Shader(
      "Mesh",
      this.geometry.vsSource,
      this.geometry.fsSource
    );

    //Create buffers
    this.buffers = {};
    this.attributes = [];

    //Positions
    this.model = mat4.create();
    mat4.translate(this.model, this.model, [0, 0, 0]);

    //Normal matrix
    this.normal = mat4.create();
    mat4.invert(this.normal, this.model);
    mat4.transpose(this.normal, this.normal);

    //IMPORTANT
    this.geometry.SetLocations(this);
    this.locations = this.geometry.locations;
  }

  AddAttribute(info) {
    this.attributes.push(info);
  }

  //utils
  BufferData(name, data) {
    if (name === "indices") {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(data),
        gl.STATIC_DRAW
      );
      this.buffers[name] = { buffer, type: gl.ELEMENT_ARRAY_BUFFER };

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, undefined);
    } else {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      this.buffers[name] = { buffer, type: gl.ARRAY_BUFFER };

      gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
    }
  }

  /**
   * @param {Camera} camera
   */
  Bind(camera) {
    this.geometry.BufferAllData(this);
    this.geometry.AddAttributeInfo(this);

    for (const a of this.attributes) {
      this.BindBuffer(a.bufferName);
      gl.vertexAttribPointer(a.location, a.size, gl.FLOAT, false, 0, a.offset);
      gl.enableVertexAttribArray(a.location);
    }

    this.SetUniforms(camera, this.model);
  }

  /**
   * @param {Camera} camera
   */
  SetUniforms(camera, model) {
    this.geometry.SetUniform(this, camera, model);

    //Translate by the model
    gl.uniformMatrix4fv(this.locations.uModelViewMatrix, false, this.model);

    //Bind normals
    gl.uniformMatrix4fv(this.locations.uNormalMatrix, false, this.normal);
  }

  BindBuffer(name) {
    const buffer = this.buffers[name];

    if (!buffer) {
      console.warn("Unable to get buffer: " + name);
      return;
    }

    gl.bindBuffer(buffer.type, buffer.buffer);
  }

  BindMaterial() {
    this.material.Bind(this);
  }

  /**
   * @param {Camera} camera
   */
  Draw(camera) {
    this.shader._use();

    this.Bind(camera);
    this.BindMaterial();

    this.geometry.Draw(this);
  }

  Rotate(x, y, z, power) {
    mat4.rotate(this.model, this.model, power * 0.3, [x, 0, 0]);
    mat4.rotate(this.model, this.model, power * 0.5, [0, y, 0]);
    mat4.rotate(this.model, this.model, power, [0, 0, z]);
  }
}
