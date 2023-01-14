import { gl } from "../Engine.js";
import { AttributeInfo } from "../geometry/BaseGeometry.js";
import Color from "../graphics/Color.js";
import Mesh from "../graphics/Mesh.js";
import { BindingColorTypes } from "../types.js";

export default class BasicMaterial {
  constructor(color = new Color(100, 0, 0, 255)) {
    this.color = color;

    this.bindingType = BindingColorTypes.attribute;
    this.lastType = this.bindingType;
  }

  SetTypeIfTexture(texture) {
    if (texture) {
      this.bindingType = BindingColorTypes.texture;
    }
  }

  /**
   * @param {Mesh} mesh
   */
  Bind(mesh) {
    switch (this.bindingType) {
      case BindingColorTypes.attribute:
        break;
      case BindingColorTypes.texture:
        // code for handling texture binding
        break;
      default:
        // code for handling other cases or errors
        break;
    }
  }
}
