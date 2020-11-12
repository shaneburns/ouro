const Cube = Class.extend({
    init: function(){
        this.mesh = new THREE.Object3D()
        this.mainCube = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: false})
        )
        this.mainCube.receiveShadow = true
        this.mainCube.castShadow = true
        this.mesh.add(this.mainCube)

        this.particles = {}
        this.particles.count = 1
        for(let i = this.particles.count; i--;){
            this.particles[i] = new particle(3)
            this.mesh.add(this.particles[i])
        }

        // this.particles[0].position.set(0, -4.5, 0)//bottom
        // this.particles[1].position.set(3, 0, 0)//left
        // this.particles[2].position.set(0, 4.5, 0)
        // this.particles[3].position.set(0, 0, 3)
        // this.particles[4].position.set(-3, 0, 0)
        // this.particles[5].position.set(0, 0, -3)

        this.mesh.position.set(0, 5, 0)

        this.setTimer()
    },
    setTimer: function(){
        this.timer = {}
        this.timer.interval = setInterval(()=>{
            mg.firstScene.world.cube.timer.flag = !mg.firstScene.world.cube.timer.flag
        }, 1750)
        this.timer.flag = true
        this.timer.tick = .01
    },
    motion: function(spin){
        this.mainCube.rotation.x += spin
        this.mainCube.rotation.y += spin

        // Particle Motion
        this.timer.tick += .05
        for(let i = this.particles.count; i--;){
            this.particles[i].orbit()
        }
        // this.mesh.rotation.x +=.01
        // this.mesh.rotation.z +=.01

    }
})
