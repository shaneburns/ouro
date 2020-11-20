import {ObjectBase} from './objectBase.js'
import {Controls} from './controls.js'
export class Character extends ObjectBase{
    constructor(creation, camera, settings = {
        body: new CANNON.Body({shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), mass: 6}),
        mesh: new THREE.Object3D()
    }){
        super(creation, settings)
        this.speed = 3
        this.v = new THREE.Vector3()
        this.a = new THREE.Vector3()
        this.renderBody = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
        this.mesh.add(this.renderBody)
        this.controls = new Controls(camera)

        // Add a line mesh to visulaize the velocity vectors length/direction
        // for testing
        this.vMagLine = {geom: new THREE.Geometry(),mat: new THREE.LineBasicMaterial({color: 0xff0000 }),m:null};
        this.vMagLine.geom.vertices.push( new THREE.Vector3(), this.v)
        this.vMagLine.geom.verticesNeedUpdate = true
        this.vMagLine.m = new THREE.Line( this.vMagLine.geom, this.vMagLine.mat )
        this.vMagLine.m.position.setY(5)
        this.mesh.add( this.vMagLine.m )
    }
    applyForce(force){
        this.a.add(force.divideScalar(this.body.mass))
    }
    updatePosition(){
        super.updatePosition()
        this.controls.camera.position.copy(this.mesh.position)
        this.controls.camera.position.y += 3
        this.controls.camera.position.z = this.mesh.position.z + 3
        //this.controls.camera.quaternion.copy(this.mesh.quaternion)
    }
    update(){
        this.currSpeed = this.speed*this.creation.tickDelta
        // InputForces
        if(this.controls.forward) this.controls.f.z-=this.currSpeed
        if(this.controls.backward) this.controls.f.z+=this.currSpeed
        if(this.controls.left) this.controls.f.x-=this.currSpeed
        if(this.controls.right) this.controls.f.x+=this.currSpeed
        if(this.controls.jump) this.controls.f.y+=this.currSpeed*2

        this.applyForce(this.controls.f.applyEuler(this.controls.camera.rotation))

        this.drag = this.v.clone()
        this.drag.normalize()
        this.dragSpeed = this.v.lengthSq()
        this.c = -2.25
        this.drag.multiplyScalar(this.c*this.dragSpeed)
        this.applyForce(this.drag)

        this.v.add(this.a)
        if(this.v.length() < 0.01)this.v.multiplyScalar(0);

        this.body.position.x += this.v.x
        this.body.position.y += this.v.y
        this.body.position.z += this.v.z

        this.vMagLine.geom.verticesNeedUpdate = true
        this.a.multiplyScalar(0)

        this.updatePosition()
    }
}