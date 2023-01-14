import { gl } from "../Engine.js";

export default class Shader {
  constructor(name, vsSource, fsSource) {
    this.name = name;

    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

    this.attributes = {};
    this.uniforms = {};

    this.program = this.initProgram(vertexShader, fragmentShader);

    this.detectAttributes();
    this.detectUniforms();
  }

  //*Meant to be used outside the class (public alike)
  GetAttributeLocation(name) {
    if (this.attributes[name] === undefined)
      throw new Error(
        `Unable to find attribute: ${name} in shader named: ${this.name}`
      );

    return this.attributes[name];
  }

  GetUniformLocation(name) {
    if (this.uniforms[name] === undefined)
      throw new Error(
        `Unable to find uniform: ${name} in shader named: ${this.name}`
      );

    return this.uniforms[name];
  }

  //*Public
  _use() {
    gl.useProgram(this.program);
  }

  //*Run internally
  detectAttributes() {
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < count; i++) {
      const attribute = gl.getActiveAttrib(this.program, i);

      if (!attribute) break;

      this.attributes[attribute.name] = gl.getAttribLocation(
        this.program,
        attribute.name
      );
    }
  }

  detectUniforms() {
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
      const uniform = gl.getActiveUniform(this.program, i);

      if (!uniform) break;

      this.uniforms[uniform.name] = gl.getUniformLocation(
        this.program,
        uniform.name
      );
    }
  }

  //*Run internally (util)
  initProgram(vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    //!Make sure we get a functional shader
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          program
        )}`
      );
      return null;
    }

    return program;
  }

  //*Util
  loadShader(type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
          shader
        )}`
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}
