// Natalia González A01382007
// Paola Villareal A00821971
// Melba Consuelos A01410921
import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/js/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js";
import Stats from "/js/jsm/libs/stats.module.js";
import dat from "/js/jsm/libs/dat.gui.module.js";
import { MTLLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js";

("using strict");

let renderer, scene, camera, cameraControl, mesh, stats, loader, pointlight;

function init() {
  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));
  document.body.appendChild(renderer.domElement);

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  let fov = 60;
  let aspect = window.innerWidth / window.innerHeight;
  let near = 0.1;
  let far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 50);
  cameraControl = new OrbitControls(camera, renderer.domElement);

  // LIGHT
  // AMBIENT LIGHT

  const light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  //LOADER
  // instantiate a loader
  loader = new OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    "models/solar-system.obj",
    // called when resource is loaded
    function (object) {
      scene.add(object);
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  const mtlLoader = new MTLLoader();
  mtlLoader.load("/models/solar-system.mtl", (mtl) => {
    mtl.preload();
    loader.setMaterials(mtl);
    loader.load("/models/solar-system.mtl", (root) => {
      scene.add(root);
    });
  });


  // STATS
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  // RENDER LOOP
  renderLoop();
}

function renderLoop() {
  stats.begin();
  renderer.render(scene, camera); // DRAW SCENE
  updateScene();
  stats.end();
  stats.update();
  requestAnimationFrame(renderLoop);
}

function updateScene() {}

// EVENT LISTENERS & HANDLERS
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
