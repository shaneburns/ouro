const Player = Class.extend({
    init: function(camera){
        console.log('I am thinking.');
        this.height = 6
        this.speed = 5
        this.strength = .4
        this.skill = .1
        this.v = new THREE.Vector3()
        this.a = new THREE.Vector3()
        this.mass = 1.4
        this.turnSpeed = Math.PI * .009
        // Setup Controls(global vars/handlers) for this object
        this.controls = new Controls(camera)
        this.yaw = this.controls.pointerLock.yawObject
        // Create the master parent obj
        this.m = new THREE.Object3D()
        this.m.add(this.yaw)
        // add an arbitrary hitbox
        // visible for testing purposes
        this.hitBox = new THREE.Mesh(
            new THREE.SphereGeometry(3, 8, 4),
            new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, transparent:true, opacity: .3} )
        )
        this.hitBox.position.y = 5
        this.hitBox.rotation.set(0,Math.PI/2,Math.PI/8)
        this.m.add(this.hitBox)

        // Add in character model
        this.model = new Laht()
        this.m.add(this.model.m)

        // Add a line mesh to visulaize the velocity vectors length/direction
        // for testing
        this.vMagLine = {geom: new THREE.Geometry(),mat: new THREE.LineBasicMaterial({color: 0xff0000 }),m:null};
        this.vMagLine.geom.vertices.push( new THREE.Vector3(), this.v)
        this.vMagLine.geom.verticesNeedUpdate = true
        this.vMagLine.m = new THREE.Line( this.vMagLine.geom, this.vMagLine.mat )
        this.vMagLine.m.position.setY(5)
        this.m.add( this.vMagLine.m )



        this.direction = new THREE.Vector3()
        // And the "RayCaster", able to test for intersections
        this.caster = new THREE.Raycaster()


    },
    flag: false,
    applyForce: function(force){
        this.a.add(force.divideScalar(this.mass))
    },
    // setDirection: function(controls){
    //     const x = controls.a ? 1 : controls.d ? -1 : 0,
    //         y = 0,
    //         z = controls.w ? 1 : controls.s ? -1 : 0
    //     this.direction.set(x, y, z)
    // },
     collision: function(obj){
        // Collision Detections a la Stemkoski
        this.ogPoint=obj.position.clone();this.verti, this.localVert, this.globalVert, this.directionV, this.ray, this.collisions = null
        for (this.verti = obj.geometry.vertices.length; this.verti--;)
        {
            this.localVert = obj.geometry.vertices[this.verti].clone();
            this.globalVert = this.localVert.applyMatrix4( obj.matrix );
            this.directionV = this.globalVert.sub( obj.parent.position.clone() );

            this.ray = new THREE.Raycaster( this.ogPoint, this.directionV.clone().normalize() );
            this.collisions = this.ray.intersectObjects( mg.collmeshlist );
            if ( this.collisions.length > 0 && this.collisions[0].distance < this.directionV.length() ){
                //console.log('HIT',this.collisions[0]);
                // Wall Collisions
                //console.log('dirVel = ',this.directionV, ', vel = ',this.v);

                // Friction Force
                // https://www.youtube.com/watch?v=HZcic7lEcmU
                const f = this.v.clone()
                f.normalize()
                const c = -.25
                f.multiplyScalar(c)
                this.applyForce(f)

            }
        }
        delete this.ogPoint, delete this.verti, delete this.localVert, delete this.globalVert, delete this.directionV, delete this.ray, delete this.collisions
    },
    update: function(){
        this.currSpeed = this.speed*mg.tickDelta
        // InputForces
        if(this.controls.forward) this.controls.f.z-=this.currSpeed
        if(this.controls.backward) this.controls.f.z+=this.currSpeed
        if(this.controls.left) this.controls.f.x-=this.currSpeed
        if(this.controls.right) this.controls.f.x+=this.currSpeed

        this.applyForce(this.controls.f)

        if(!this.controls.w && !this.controls.a && !this.controls.s && !this.controls.d){
            //for whatever later when I need this, you know
        }

        // Collision detection
        // Just pass in the objects mesh. done
        this.collision(this.hitBox)

        // const f = this.v.clone()
        // f.normalize()
        // this.c = -.02
        // f.multiplyScalar(this.c)
        // this.applyForce(f)

        // Drag Force
        this.drag = this.v.clone()
        this.drag.normalize()
        this.dragSpeed = this.v.lengthSq()
        this.c = -2.25
        this.drag.multiplyScalar(this.c*this.dragSpeed)
        this.applyForce(this.drag)

        this.v.add(this.a)
        if(this.v.length() < 0.025)this.v.multiplyScalar(0)

        this.m.position.add(this.v)
        this.vMagLine.geom.verticesNeedUpdate = true
        //this.m.rotation.set(this.yaw.rotation.clone())
        this.a.multiplyScalar(0)

        this.model.update()
    }

})
