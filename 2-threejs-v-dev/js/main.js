//import { ACESFilmicToneMapping } from '../build/three.module';
import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/js/jsm/controls/OrbitControls.js';
import Stats from '/js/jsm/libs/stats.module.js';

let renderer, scene, camera, mesh, cameraControl, stats;

        function init() {

            // RENDERER
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));
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
            // let ns = 10;
            let geometry = new THREE.SphereGeometry();
            let material = new THREE.MeshBasicMaterial({color: "white", wireframe: true});
            mesh = new THREE.Mesh(geometry, material);
            // let mesh2 = new THREE.Mesh(geometry, material);
            // mesh2.position.x = -1.5;

            // SCENE GRAPH
            scene.add(mesh);
            
            
            // scene.add(mesh2);

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
           // mesh.rotation.y = mesh.rotation.y + 1 * Math.PI / 180; // en radianes
        }

        // EVENT LISTENERS & HANDLERS
        document.addEventListener("DOMContentLoaded", init);

        window.addEventListener("resize", function(){
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect  = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });