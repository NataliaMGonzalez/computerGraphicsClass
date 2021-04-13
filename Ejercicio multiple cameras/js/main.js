import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/js/jsm/controls/OrbitControls.js';
import Stats from '/js/jsm/libs/stats.module.js';
import dat from '/js/jsm/libs/dat.gui.module.js';

"using strict";

let renderer, scene, camera1, camera2, camera3, camera4, cameraControl, mesh, stats;
let multiview = false;

function init() {
    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA 1 : Perspective view (default)
    let fov = 60;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.1;
    let far = 10000;
    camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera1.position.set(1, 1, 3);
    cameraControl = new OrbitControls(camera1, renderer.domElement);

    // CAMERA 2 : Top view
    aspect = (window.innerWidth / 2) / window.innerHeight;
    camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera2.position.set(0, 3, 0);
    camera2.lookAt(new THREE.Vector3(0, 0, 0));
    camera2.up.set(0, 0, 1);

    // CAMERA 3 : Front view
    aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
    camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera3.position.set(0, 0, 3);
    camera3.lookAt(new THREE.Vector3(0, 0, 0));
    camera3.up.set(0, 1, 0);

    // CAMERA 4 : Lateral view
    aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
    camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera4.position.set(3, 0, 0);
    camera4.lookAt(new THREE.Vector3(0, 0, 0));
    camera4.up.set(0, 1, 0);

    // MODELS
    let geometry = new THREE.ConeGeometry();
    let material = new THREE.MeshBasicMaterial({ color: "white", wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Cone";

    // SCENE GRAPH
    scene.add(mesh);

    // GUI
    let gui = new dat.GUI();

    // model
    let listColors = ["White", "Red", "Blue"];
    let model = {
        rotY: mesh.rotation.y * 180 / Math.PI,
        posHome: function () {
            mesh.position.x = 0;
            model.rotY = 0;
            mesh.rotation.y = model.rotY;
        },
        listColors,
        defaultItem: listColors[0],
        colorPalette: [255, 255, 255]
    }
    // view & controller

    // General menu
    let generalMenu = gui.addFolder("General Menu");
    // TextField Model Name
    let tfMeshName = generalMenu.add(mesh, "name").name("Model's Name").onChange(function (value) {

    }).onFinishChange(function (value) {
        console.log(mesh.name);
    });
    generalMenu.open();

    // Position Menu
    let posMenu = gui.addFolder("Model's Position Menu");
    //posMenu.open();
    //Model Position
    let sliderPosX = posMenu.add(mesh.position, "x").min(-5).max(5).step(0.5).name("X").listen().onChange(function (value) {

    });
    // Button Position Home
    let btnPosHome = posMenu.add(model, "posHome").name("HOME");

    // Rotation Menu
    let rotMenu = gui.addFolder("Model's Rotation Menu");
    // Model Orientation
    let sliderRotY = rotMenu.add(model, "rotY").min(-180).max(180).step(5).name("Y (deg)").listen().onChange(function (value) {
        mesh.rotation.y = value * Math.PI / 180;
    });

    // Model's Appearance Menu
    let appearMenu = gui.addFolder("Model's Appeareance Menu");
    // Model Draw Mode
    let chbWireframe = appearMenu.add(mesh.material, "wireframe").setValue(true).name("Wireframe").onChange(function (value) {

    });
    let listColor = appearMenu.add(model, "defaultItem", model.listColors).name("Color List").onChange(function (item) {
        mesh.material.color = new THREE.Color(item.toLowerCase());
        model.colorPalette = [mesh.material.color.r * 255, mesh.material.color.g * 255, mesh.material.color.b * 255];
    });
    let colorPalette = appearMenu.addColor(model, "colorPalette").name("Color Palette").listen().onChange(function (color) {
        mesh.material.color = new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255);
    });

    gui.close();

    // STATS
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // RENDER LOOP
    renderLoop();
}

function renderLoop() {
    stats.begin();
    if (!multiview) {
        // camera 1
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera1); // DRAW SCENE  
    } else {
        // camera 1
        camera1.aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
        camera1.updateProjectionMatrix();
        renderer.setViewport(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
        renderer.setScissor(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
        renderer.render(scene, camera1); // DRAW SCENE  
        // camera 2
        camera2.aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
        camera2.updateProjectionMatrix();
        renderer.setViewport(0, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
        renderer.setScissor(0, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
        renderer.render(scene, camera2); // DRAW SCENE  
        // camera 3
        camera3.aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
        camera3.updateProjectionMatrix();
        renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight / 2);
        renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight / 2);
        renderer.render(scene, camera3); // DRAW SCENE  
        // camera 4
        camera4.aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
        camera4.updateProjectionMatrix();
        renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        renderer.render(scene, camera4); // DRAW SCENE  
    }
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {

}

// EVENT LISTENERS & HANDLERS
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera1.aspect = window.innerWidth / window.innerHeight;
    camera1.updateProjectionMatrix();
});

document.addEventListener("keydown", (ev) => {
    if (ev.key == " ") {
        multiview = !multiview
    }
});