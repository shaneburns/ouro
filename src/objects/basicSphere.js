import {ObjectBase} from './objectBase.js'

export class BasicSphere extends ObjectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: new CANNON.Sphere(1), mass: 4}),
        mesh: new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings);
        this.mesh.castShadow = true;
        this.mesh.recieveShadow = false;
    }
}