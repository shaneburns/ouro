const Sphere = AutoAnimObj.extend({
    init: function(sphereGeom,sphereMat){
        this._super()
        this.m = new THREE.Mesh(sphereGeom, sphereMat)
        this.setVel(this.v.max, this.v.max, this.v.max)
    },
    render: function(){
        this.checkAll()
    }
})
