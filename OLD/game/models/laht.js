const Laht = Class.extend({
    init: function(){
        this.isActive = false
        this.m = new THREE.Object3D() // m for mesh

        this.cubeMatrix = new CubeMatrix()
        this.cubeMatrix.setRot('continuous','continuous','continuous')
        this.cubeMatrix.v.rate = .005
        this.m.add(this.cubeMatrix.m)

        this.core = new core()
        this.m.add(this.core.m)
        this.core.m.scale.set(.1,.1,.1)
        this.core.shrink()

        // Setup Particle System: pSys
        this.pSys = new particleSystem(300)
        // Turn on flicker animation for pSys
        this.pSys.flicker = true
        //Setup Horizontal Orbit for pSys
        this.pSys.setupOrbit('verticle')
        //this.pSys.setupFloat({max: .0035, min: -.0035})
        this.m.add(this.pSys.m)

        this.m.position.set(0, 5, 0)
        this.pSys.play()

        this.timer = {}
        this.setTimer()
        //this.activate()
    },
    setTimer: function(){
        this.timer.interval = setInterval(()=>{this.flipCubeFlag();}, 1750)
        this.timer.flag = true
    },
    flipCubeFlag: function(){
        this.timer.flag = !this.timer.flag
        if(this.timer.flag){
            this.cubeMatrix.setVel(.13, .13, 0)
        }else{
            this.cubeMatrix.setVel(-.005, -.005, .09)
        }
    },
    activate: function(){
        if(this.isActive){return;}
        this.isActive = true
        this.cubeMatrix.openMatrix()
        clearTimeout(this.timer.interval)
        this.timer.interval = null
        //this.core.grow()
    },
    deActivate: function(){
        if(!this.isActive){return;}
        this.isActive = false
        this.cubeMatrix.closeMatrix()
        this.setTimer()
        this.core.shrink()
    },
    motion: function(){
        //old news
    },
    update: function(){
        // Update Core Time with Tick
        this.core.render()

        // Cube Matrix Motion
        this.cubeMatrix.render()

        // Particle Motion
        this.pSys.render()
    }
})
