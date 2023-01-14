import Mesh from "../graphics/Mesh.js";
import { gl } from "../Engine.js";
import BaseGeometry, { AttributeInfo } from "./BaseGeometry.js";
import BasicMaterial from "../material/BasicMaterial.js";

//Shaders
const vsShader = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    varying lowp vec4 vColor;


    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

        // Apply lighting effect

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);

        vColor = aVertexColor;
    }
`;

const fsShader = `
  precision highp float;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  varying lowp vec4 vColor;

    void main() {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    }
`;

const textureVsShader = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  attribute vec4 aVertexColor;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);

    vColor = aVertexColor;
  }
`;

const textureFsShader = `
  uniform sampler2D uSampler;
  
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main() {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
`;

export default class BoxGeometry extends BaseGeometry {
  constructor({ texture = undefined }) {
    super();

    this.texture = texture;

    //Reset the sources if the texture exists
    if (this.texture) {
      this.vsSource = textureVsShader;
      this.fsSource = textureFsShader;
    } else {
      //Set to the normal
      this.vsSource = vsShader;
      this.fsSource = fsShader;
    }

    this.textureName = "aTextureCoord";
    this.textureCoordinates = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    this.vertexName = "aVertexPosition";
    this.vertexPositionData = [
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    this.indicesName = "indices";
    this.indices = [
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];

    this.normalsName = "aVertexNormal";
    this.normals = [
      // Front
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

      // Back
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

      // Top
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

      // Bottom
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

      // Right
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

      // Left
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ];

    this.faceColors = [
      [1, 1.0, 1.0, 1.0], // Front face: white
      [1, 0.0, 0.0, 1.0], // Back face: red
      [1, 1.0, 0.0, 1.0], // Top face: green
      [1, 0.0, 1.0, 1.0], // Bottom face: blue
      [1, 1.0, 0.0, 1.0], // Right face: yellow
      [1, 0.0, 1.0, 1.0], // Left face: purple
    ];

    //Write it
    this.colorsName = "aVertexColor";
    this.colors = [];

    for (let i = 0; i < this.faceColors.length; ++i) {
      const c = this.faceColors[i];
      this.colors = this.colors.concat(c, c, c, c);
    }

    this.locations = {
      uProjectionMatrix: null,
      uModelViewMatrix: null,
      uNormalMatrix: null,
    };
  }

  /**
   * @param {Mesh} mesh
   * @param {BasicMaterial} material
   */
  Bind(mesh, material) {
    const color = material.color;

    const r = color.floatR;
    const g = color.floatG;
    const b = color.floatB;
    const a = color.floatA;

    this.faceColors = [
      [r, g, b, a], // Front face: white
      [r, g, b, a], // Back face: red
      [r, g, b, a], // Top face: green
      [r, g, b, a], // Bottom face: blue
      [r, g, b, a], // Right face: yellow
      [r, g, b, a], // Left face: purple
    ];

    this.ReWriteColors();
  }

  /**
   * @param {Mesh} mesh
   */
  SetLocations(mesh) {
    const uProjectionMatrix =
      mesh.shader.GetUniformLocation("uProjectionMatrix");

    const uModelViewMatrix = mesh.shader.GetUniformLocation("uModelViewMatrix");

    const uNormalMatrix = mesh.shader.GetUniformLocation("uNormalMatrix");

    this.locations = { uProjectionMatrix, uModelViewMatrix, uNormalMatrix };
  }

  /**
   * @param {Mesh} mesh
   */
  BufferAllData(mesh) {
    mesh.BufferData(this.vertexName, this.vertexPositionData);
    mesh.BufferData(this.indicesName, this.indices);
    mesh.BufferData(this.normalsName, this.normals);
    mesh.BufferData(this.colorsName, this.colors);

    if (this.texture) {
      mesh.BufferData(this.textureName, this.textureCoordinates);
    }
  }

  ReWriteColors() {
    //Write it
    this.colorsName = "aVertexColor";
    this.colors = [];

    for (let j = 0; j < this.faceColors.length; ++j) {
      const c = this.faceColors[j];
      this.colors = this.colors.concat(c, c, c, c);
    }
  }

  /**
   * @param {Mesh} mesh
   */
  AddAttributeInfo(mesh) {
    const vertexLocation = mesh.shader.GetAttributeLocation(this.vertexName);
    mesh.AddAttribute(new AttributeInfo(vertexLocation, 0, 3, this.vertexName));

    const normalsLocation = mesh.shader.GetAttributeLocation(this.normalsName);
    mesh.AddAttribute(
      new AttributeInfo(normalsLocation, 0, 3, this.normalsName)
    );

    const colorLocation = mesh.shader.GetAttributeLocation(this.colorsName);
    mesh.AddAttribute(new AttributeInfo(colorLocation, 0, 4, this.colorsName));

    if (this.texture) {
      const textureLocation = mesh.shader.GetAttributeLocation(
        this.textureName
      );

      mesh.AddAttribute(
        new AttributeInfo(textureLocation, 0, 2, this.textureName)
      );
    }
  }

  /**
   * @param {Mesh} mesh
   */
  Draw(mesh) {
    mesh.BindBuffer(this.vertexName);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);

    mesh.BindBuffer(this.indicesName);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    if (this.texture) {
      const sampler = mesh.shader.GetUniformLocation("uSampler");

      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);

      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);

      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(sampler, 0);
    }
  }
}
