import {objectBase} from './../core/objectBase.js'

export class basicCube extends objectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), mass: 4}),
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(0.5, 0.5, 0.5), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings)
    }
}