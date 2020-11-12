const particle = AutoAnimObj.extend({
    init: function(rad, dist){
        this._super()
        dist = dist + mg.rand(1, -1)
        // m for mesh
        this.m = new THREE.Object3D()

        // p for particle
        this.p = new Sphere(
            new THREE.SphereGeometry(rad, 3, 2),
            new THREE.MeshLambertMaterial({
                color: 0xff0000,
                transparent: true
            })
        )
        this.m.add(this.p.m)

        this.p.setYPos(dist)
        this.p.m.material.opacity = mg.rand()
        this.p.setOpacity(this.p.m.material.opacity)
        this.p.modScale(mg.rand(.3,-.5))

        this.setVel(mg.rand(this.v.max), mg.rand(this.v.max), mg.rand(this.v.max))

    },// End this.init() -----------------------------------------------------//
    checkAll: function(){
        this.checkVel()
        this.checkPos()
        this.checkRot()
        this.checkScale()
    },
    render: function(){
        this.checkAll()
        this.p.render()
    }
})
