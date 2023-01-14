export default class Color {
  /**
   * DEFAULTS TO WHITE
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   * @param {Number} a
   */
  constructor(r = 255, g = 255, b = 255, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    //0 to 1 range supported by WebGL
    this.floatR = this.r / 255;
    this.floatG = this.g / 255;
    this.floatB = this.b / 255;
    this.floatA = this.a / 255;
  }

  static Red() {
    return new Color(255, 0, 0, 255);
  }

  static Green() {
    return new Color(0, 255, 0, 255);
  }

  static Blue() {
    return new Color(0, 0, 255, 255);
  }

  ToArray() {
    return [this.r, this.g, this.b, this.a];
  }

  ToFloatArray() {
    //Might need to set this to be something like this.r / 255.0, this.g / 255.0
    return [this.floatR, this.floatG, this.floatB, this.floatA];
  }

  ToFloat32Array() {
    return new Float32Array(this.ToFloatArray());
  }
}
