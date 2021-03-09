import * as THREE from '/build/three.module.js';

class Mesh extends THREE.Mesh {
    constructor() {
        super();
    }
    setWireframe(value) {
        this.material.wireframe = value;
    }
}

class Quad extends Mesh {
    constructor() {
        super();
        // QUAD
        let vertices = [-0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0];
        let indices = [0,1,2, 0,2,3];

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometry.setIndex(indices);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

export {Quad};