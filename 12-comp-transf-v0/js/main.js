import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, box, cameraControls, gui, stats;
window.anim = false;

function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fovy = 60.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 0.1;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(2, 2, 3);
    cameraControls = new OrbitControls(camera, renderer.domElement);
            
    // MODELS
    // BOX
    box = new Box();
    
    box.matrixAutoUpdate = false;
    // box.position.set(2,0,0);
    // box.rotation.set(0, Math.PI/4, 0);
    // M = T(2,0,0) Ry(45)
    // Matrices identidad
    let T = new THREE.Matrix4();
    let Ry = new THREE.Matrix4();
    let M = new THREE.Matrix4();
    T.makeTranslation(2, 0, 0);
    Ry.makeRotationY(Math.PI / 4);
    M.multiplyMatrices(T, Ry);
    box.matrix.copy(M);
    



    // M = T R(45) T(2,0,0)
    // FLOOR
    let floor = new Floor();
    // WORLD AXES
    let worldAxes = new THREE.AxesHelper(10);

    // SCENE HIERARCHY
    scene.add(box);
    scene.add(floor);
    scene.add(worldAxes);

    // GUI
    gui = new dat.GUI();
    // SHOW/HIDE FLOOR
    gui.add(floor, "visible").name("Floor").setValue(false).listen().onChange(function(value) {

    });
    // SHOW/HIDE WORLD-AXES
    gui.add(worldAxes, "visible").name("World Axes").setValue(false).listen().onChange(function(value) {

    });
    // SHOW-HIDE LOCAL-AXES
    let localAxes = {
        visible: false
    };
    gui.add(localAxes, "visible").name("Local Axes").listen().onChange(function(value) {
        box.axes.visible = value;
    });
    gui.add(window, "anim").name("Animation").listen().onChange(function(value) {

    });
    gui.open();

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
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
    if(anim) {
        box.rotation.y = box.rotation.y + 0.01;
    }
}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// MODELS
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

 // BOX
 class Box extends THREE.Mesh {
    constructor(color = "yellow", colorWireframe = new THREE.Color(0, 0, 0)) {
        super();
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshBasicMaterial({color});
        // WIREFRAME HELPER
        this.wireframeHelper = new THREE.LineSegments(new THREE.WireframeGeometry(this.geometry));
        this.wireframeHelper.material.color = colorWireframe;
        // LOCAL AXES
        this.geometry.computeBoundingSphere();
        this.axes = new THREE.AxesHelper(this.geometry.boundingSphere.radius * 1.5);
        this.axes.visible = false;
        // CHILDREN
        this.add(this.wireframeHelper);
        this.add(this.axes);
    }
    getCentroid() {
        this.geometry.computeBoundingSphere();
        return this.geometry.boundingSphere.center;
    }
}