// Natalia González A01382007
import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/js/jsm/controls/OrbitControls.js';
import Stats from '/js/jsm/libs/stats.module.js';
import dat from '/js/jsm/libs/dat.gui.module.js';

"using strict";

let renderer, scene, camera, cameraControl, mesh, stats;

function init() {
    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
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

    camera.position.set(0, 0, 3);
    cameraControl = new OrbitControls(camera, renderer.domElement);

    // MODELS
    let geometry = new THREE.ConeGeometry();
    let material = new THREE.MeshBasicMaterial({color: "yellow", wireframe: false});
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Cube";
    mesh.position.set(0, 0.5, 0);

     // WORLD AXES
     let worldAxes = new THREE.AxesHelper(10);

    // SCENE GRAPH
    scene.add(mesh);
    scene.add(worldAxes);

    // GUI
    let gui = new dat.GUI();

     // SHOW/HIDE WORLD-AXES
     gui.add(worldAxes, "visible").name("World Axes").setValue(false).listen().onChange(function(value) {
 
     });

     // SHOW/HIDE WORLD-AXES
     let params =  {
         frontView: true,
         topView: false,
         sideView: false
     };
     gui.add(params, "frontView").name("Front View").setValue(false).listen().onChange(function(value) {
        params.topView = false;
        params.sideView = false;
        camera.position.set(0,0,5);
        camera.up = new THREE.Vector3(0,1,0);
        camera.lookAt(new THREE.Vector3(0,0,0));
    });
    gui.add(params, "topView").name("Top View").setValue(false).listen().onChange(function(value) {
        params.frontView = false;
        params.sideView = false;
        camera.position.set(0,5,0);
        camera.up = new THREE.Vector3(0,1,0);
        camera.lookAt(new THREE.Vector3(0,0,0));

    });
    gui.add(params, "sideView").name("Side View").setValue(false).listen().onChange(function(value) {
        params.topView = false;
        params.frontView = false;
        camera.position.set(5,0,0);
        camera.up = new THREE.Vector3(0,1,0);
        camera.lookAt(new THREE.Vector3(0,0,0));
        
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

function updateScene() {
    
}

// EVENT LISTENERS & HANDLERS
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


class Floor extends THREE.Mesh {
    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        this.material = new THREE.MeshBasicMaterial();
        this.rotation.x = -0.5 * Math.PI;
        this.wireframeHelper = new THREE.LineSegments(new THREE.WireframeGeometry(this.geometry));
        this.wireframeHelper.material.color = new THREE.Color(0.2, 0.2, 0.2);
        this.add(this.wireframeHelper);
        this.visible = false;
    }
}