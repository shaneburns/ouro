const pyramid = Class.extend({
    init: function(){
        this.m = new THREE.Object3D()

        this.base = new THREE.Mesh(
            new THREE.CylinderGeometry(7, 14, 10, 3),
            new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xffffff})
        )
        this.base.position.y = 5
        this.base.receiveShadow = true
        this.base.castShadow = true

        this.top = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 6, 10, 3),
            new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xffffff})
        )
        this.top.position.y = 17
        this.top.receiveShadow = true
        this.top.castShadow = true

        this.m.add(this.base)
        this.m.add(this.top)
    }
})
