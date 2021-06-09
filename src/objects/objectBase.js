export class ObjectBase {
    constructor(creation, settings = {}){
        this.creation = creation
        this.loaded = false
        this.mtl = settings.mtl ?? null
        this.geo = settings.geo ?? null
        this.mesh = settings.mesh ?? ((this.mtl !== null && this.geo !== null) ? new THREE.Mesh(this.geo, this.mtl) : null)
        this.body = settings.body ?? new CANNON.Body({mass: settings.mass ?? 1, shape: settings.shape ?? null})
        this.animations = settings.animations ?? null
        this.mixer = null
    }
    setMixer(){
        this.mixer = new THREE.AnimationMixer(this.mesh)
        this.animations.forEach((clip) => {this.mixer.clipAction(clip).play(); });
        this.mixer.setTime(Math.random()*60)
        this.loaded = true
    }
    updatePosition(){
        this.mesh.position.copy(this.body.position)
        this.mesh.quaternion.copy(this.body.quaternion)

        if(this.loaded) this.mixer.update(this.creation.tickDelta)
    }

}