const Block0 = Class.extend({
    init: function(){

        this.m = new THREE.Object3D()
        // Add Bounderies/Obstacles, etc.
        this.walls = new THREE.Mesh(
            new THREE.BoxGeometry(60, 60, 300),
            new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xffffff, side: THREE.BackSide, wireframe: false})
        )
        this.walls.position.y = 30.3
        this.walls.receiveShadow = true
        this.walls.castShadow = true
        mg.collmeshlist.push(this.walls)// make this mesh collidable
        this.m.add(this.walls)

        this.ceilingLights = []
        let distance = this.walls.geometry.parameters.depth / 5
        //for(let i = 5)
        this.ceilingLights.push(new THREE.PointLight(0xffffff, 2, 15, 2))
        this.ceilingLights[0].position.set(0, 5, 0)
        this.ceilingLights[0].castShadow = true
        this.ceilingLights[0].shadow.camera.near = .1; this.ceilingLights[0].shadow.camera.far = 25
        this.m.add(this.ceilingLights[0])

    },
    update: function(){
    }
})
