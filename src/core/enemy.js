import {ObjectBase} from './objectBase.js'
import {Controls} from './controls.js'

export class Enemy extends ObjectBase{
    constructor(creation, camera, settings = {
        body: new CANNON.Body({shape: new CANNON.Sphere(1), mass:5}),
        mesh: new THREE.Object3D()
    }){
        super(creation, settings)

        this.speed = 30
        this.model = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 10, 10), new THREE.MeshLambertMaterial({color: 0xFFFFFF}))
        this.mesh.add(this.model)
        this.controls = new Controls(creation, camera, this.model)

        // Add a line mesh to visulaize the velocity vectors length/direction
        // for testing
        this.vMagLine = {geom: new THREE.Geometry(),mat: new THREE.LineBasicMaterial({color: 0xff0000 }),m:null}
        this.vMagLine.geom.vertices.push( new THREE.Vector3(), this.body.velocity)
        this.vMagLine.geom.verticesNeedUpdate = true
        this.vMagLine.m = new THREE.Line( this.vMagLine.geom, this.vMagLine.mat )
        this.vMagLine.m.position.setY(2)
        this.mesh.add( this.vMagLine.m )
    }
    applyForce(force){
        this.a.add(force.divideScalar(this.body.mass))
    }
    updatePosition(){
        //super.updatePosition()
        this.mesh.position.copy(this.body.position)
        this.model.quaternion.copy(this.body.quaternion)
    }
    update(){
        this.currSpeed = this.speed - Math.pow(0.001, this.creation.tickDelta)
        this.controls.update()
        this.body.applyForce(
            this.controls.getForce().multiplyScalar(this.currSpeed),
            this.body.pointToWorldFrame(new CANNON.Vec3())
        )

        this.vMagLine.geom.verticesNeedUpdate = true

        this.updatePosition()
    }
}