//import * as CANNON from './../../node_modules/cannon/build/cannon.js'

export class ObjectBase {
    constructor(creation, settings = {}){
        this.creation = creation
        this.mtl = settings.mtl ?? null
        this.geo = settings.geo ?? null
        this.mesh = settings.mesh ?? new THREE.Mesh(this.geo, this.mtl)
        this.body = settings.body ?? new CANNON.Body({mass: settings.mass ?? 1, shape: settings.shape ?? null})
        
        
    }
    updatePosition(){
        this.mesh.position.copy(this.body.position)
        this.mesh.quaternion.copy(this.body.quaternion)
    }

}