const Cube = AutoAnimObj.extend({
    init: function(cubeGeom,cubeMat){
        this._super()
        this.m = new THREE.Mesh(cubeGeom, cubeMat)
        this.m.receiveShadow = true
        this.m.castShadow = true

        this.setVel(this.v.max, this.v.max, this.v.max)
    },
    render: function(){
        this.checkAll()
    }
})
