import Camera from "./script/code/Camera.js";
import Texture from "./script/code/Texture.js";
import Engine from "./script/Engine.js";
import BoxGeometry from "./script/geometry/BoxGeometry.js";
import Mesh from "./script/graphics/Mesh.js";

const engine = new Engine();

const camera = new Camera(45);

const mesh = new Mesh({
  geometry: new BoxGeometry({
    texture: new Texture("cube.png"),
  }),
});

engine.AddMesh(mesh);

function r() {
  requestAnimationFrame(r);
  mesh.Rotate(1, 1, 0, 0.02);
  engine.Render(camera);
}

r();
