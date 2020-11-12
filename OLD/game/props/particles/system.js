const particleSystem = Class.extend({
    init: function(count, vel={max:.0175,min:.005}){
        this.m = new THREE.Object3D()// m for mesh

        this.rot = {x: {max: 0, min: 0}, y: {max: 0, min: 0}, z: {max: 0, min: 0}}
        this.vel = {x: vel, y: vel, z: vel}
        this.dist = {max: 0, min: 0}

        this.isAnimating = false
        this.float = {flag: false, velRange: {max: 0, min: 0}}
        this.flicker = false
        this.orbit = {
            plot: false,
            type: null,
            continuous: {x: 0, y:0,z:0},
            isAnimating: false
        }

        this.particles = {count: count}
        for(let i = this.particles.count; i--;){
            this.particles[i] = new particle(.04, 4)
            this.m.add(this.particles[i].m)
        }

        this.updateVel()
    },
    // MAIN PROPERTY MODIFIERS -----------------------------------------------//
    // = Rotation =
    setRotMatrix: function(rotMatrix = this.rot){
        this.rot = rotMatrix
        this.updateRot()
    },
    updateRot: function(){
        for(let i = this.particles.count; i--;){
            this.particles[i].setXRot(mg.rand(this.rot.x.max, this.rot.x.min))
            this.particles[i].setYRot(mg.rand(this.rot.y.max, this.rot.y.min))
            this.particles[i].setZRot(mg.rand(this.rot.z.max, this.rot.z.min))
        }
    },
    // = Velocity =
    setVel: function(velMatrix){
        this.vel = velMatrix
        this.updateVel()
    },
    updateVel: function(){
        for(let i = this.particles.count; i--;){
            this.particles[i].setXVel((this.vel.x == 'instant') ? this.vel.x : mg.rand(this.vel.x.max, this.vel.x.min))
            this.particles[i].setYVel((this.vel.y == 'instant') ? this.vel.y : mg.rand(this.vel.y.max, this.vel.y.min))
            this.particles[i].setZVel((this.vel.z == 'instant') ? this.vel.z : mg.rand(this.vel.z.max, this.vel.z.min))
        }
    },
    resetVel: function(x = 0, y = 0, z = 0){
        for(let i = this.particles.count; i--;){
            this.particles[i].setXVel(0)
            this.particles[i].setYVel(0)
            this.particles[i].setZVel(0)
        }
    },
    ////////////////////////////////////////////////////////////////////////
    // ANIMATIONS -------------------------------------------------------//
    //////////////////////////////////////////////////////////////////////
    play: function(){
        this.isAnimating = true
    },
    pause: function(){
        this.isAnimating = false
    },
    absorb: function(speed = 'same'){
        for(let i = this.particles.count; i--;){
            if(speed == 'fast'){
                this.particles[i].p.setYVel(this.particles[i].v.curr.y * 2)
            }else if(speed == 'slow'){
                this.particles[i].p.setYVel(this.particles[i].v.curr.y / 2)
            }
            this.particles[i].p.setDist(0)
        }
    },
    exude: function(){
        for(let i = this.particles.count; i--;){
            this.particles[i].p.setDist(mg.rand(5,3.5))
        }
    },
    // FLICKER  --------------------------------------------------------------//
    animFlicker: function(){
        for(let i = this.particles.count; i--;){
            if(this.particles[i].p.m.material.opacity === 1){
                this.particles[i].p.setOpacity(0)
            }else if(this.particles[i].p.m.material.opacity === 0){
                this.particles[i].p.setOpacity(1)
            }else if (!this.particles[i].p.o.isAnimating){
                this.particles[i].p.setOpacity(0)
            }
        }
    },
    // ORBIT -----------------------------------------------------------------//
    setupOrbit: function(type = null, contMatrix = null){
        this.orbit.type = type
        if(this.orbit.type == null){
            this.orbit.continuous = contMatrix
            this.orbit.plot = true
        }else if(this.orbit.type == 'horizontal'){
            this.setRotMatrix(
                {
                    x: {max: (Math.PI/2)+.15, min: (Math.PI/2)-.15},
                    y: {max: -Math.PI/8+.15, min: -Math.PI/8-.15},
                    z: {max: Math.PI*2, min: -Math.PI*2}
                }
            )
            this.orbit.continuous = {x:0, y:0, z:1}
            this.orbit.plot = true
        }else if(this.orbit.type == 'verticle'){
            this.setRotMatrix({
                x:{max: Math.PI/48+.15, min: Math.PI/48-.15},
                y:{max: Math.PI/24+.15, min: -Math.PI/24-.15},
                z:{max: Math.PI*2, min: -Math.PI*2}
            })
            this.orbit.continuous = {x:0, y:0, z:1}
            this.orbit.plot = true
        }
    },
    plotOrbit: function(){
        if(this.orbit.continuous.x){ this.xOrbit(); }
        if(this.orbit.continuous.y){ this.yOrbit(); }
        if(this.orbit.continuous.z){ this.zOrbit(); }
        this.orbit.plot = false
        this.orbit.isAnimating = true
    },
    xOrbit: function(){
        for(let i = this.particles.count; i--;){ this.particles[i].setXRot('continuous'); }
    },
    yOrbit: function(){
        for(let i = this.particles.count; i--;){ this.particles[i].setYRot('continuous'); }
    },
    zOrbit: function(){
        for(let i = this.particles.count; i--;){ this.particles[i].setZRot('continuous'); }
    },
    stopOrbit: function(){
        if(this.orbit.isAnimating){
            this.orbit.isAnimating = false
            for(let i = this.particles.count; i--;){
                this.particles[i].setXRot(this.particles[i].m.rotation.x)
                this.particles[i].setYRot(this.particles[i].m.rotation.y)
                this.particles[i].setZRot(this.particles[i].m.rotation.z)
            }
        }
    },
    //////////////////////////////////////////////////////////////////////////
    // = Check All = -----------------------------------------------------///
    ////////////////////////
    checkAll: function(){
        if(this.flicker){ this.animFlicker(); }
        if(this.orbit.plot){ this.plotOrbit(); }
        if(this.float.flag){ this.animFloat(); }
    },
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render: function(){
        this.checkAll()
        if(this.isAnimating){
            for(let i = this.particles.count; i--;){
                this.particles[i].render()
            }
        }
    }
})
