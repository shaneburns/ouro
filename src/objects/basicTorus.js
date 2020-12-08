import {ObjectBase} from './objectBase.js'
export class BasicTorus extends ObjectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: CANNON.Trimesh.createTorus(5, 1, 16, 16), mass: 1}),
        mesh: new THREE.Mesh(new THREE.TorusBufferGeometry(5, 1, 16, 16), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings) 
    }
}