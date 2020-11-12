const AutoAnimObj = Class.extend({
    init: function(){
        // v for velocity
        this.v = {
            curr: new THREE.Vector3(),
            temp: new THREE.Vector3(),
            diff: new THREE.Vector3(),
            max: .1,
            rate: .001,
            instant: {x: false, y: false, z: false},
            isAnimating: {x: false, y: false, z: false}
        }

        // pos for Position
        this.pos = {
            temp: new THREE.Vector3(),
            diff: new THREE.Vector3(),
            max: null,
            isAnimating: {x:false, y:false, z: false}
        }

        // r for Rotaion
        this.r = {
            temp: new THREE.Vector3(),
            diff: new THREE.Vector3(),
            max: Math.PI*2,
            isAnimating: {x: false, y: false, z: true},
            continuous: {x: 0, y: 0, z: 0}
        }

        // s for Scale
        this.s = {
            temp: new THREE.Vector3(1,1,1),
            diff: new THREE.Vector3(),
            isAnimating: {x:false, y:false, z: false}
        }

        // o for Opacity
        this.o = {temp: mg.rand(), rate: .01, isAnimating: false}
    },

    //  Velocity Mods --------------------------------------------------------//
    ///////////////////////////////////////> = WIP =
    setXVel: function(v){
        if(v == 'instant'){this.v.instant.x = true; return true;}else if(this.v.instant.x){this.v.instant.x = false;}
        this.v.temp.x = this.capVel(v)
    },
    setYVel: function(v){
        if(v == 'instant'){this.v.instant.y = true; return true;}else if(this.v.instant.y){this.v.instant.y = false;}
        this.v.temp.y = this.capVel(v)
    },
    setZVel: function(v){
        if(v == 'instant'){this.v.instant.z = true; return true;}else if(this.v.instant.z){this.v.instant.z = false;}
        this.v.temp.z = this.capVel(v)
    },
    setVel: function(x,y,z){
        this.setXVel(x)
        this.setYVel(y)
        this.setZVel(z)
    },
    capVel: function(val){
        if(val > this.v.max){ return this.v.max; }
        else if(val < -this.v.max){ return -this.v.max; }
        return val;
    },
    checkVel: function(){
        if(this.v.instant.x){ this.v.curr.x = this.v.temp.x; }else if(this.v.curr.x != this.v.temp.x){ this.v.isAnimating.x = true; this.animXVel(); }
        if(this.v.instant.y){ this.v.curr.y = this.v.temp.y; }else if(this.v.curr.y != this.v.temp.y){ this.v.isAnimating.y = true; this.animYVel(); }
        if(this.v.instant.z){ this.v.curr.z = this.v.temp.z; }else if(this.v.curr.z != this.v.temp.z){ this.v.isAnimating.z = true; this.animZVel(); }
    },
    animXVel: function(){
        this.v.diff.x = mg.abs(this.v.curr.x - this.v.temp.x)
        if(this.v.diff.x < this.v.rate){ this.v.curr.x = this.v.temp.x; this.v.isAnimating.x = false; return true; }
        this.v.curr.x += (this.v.curr.x < this.v.temp.x) ? this.v.rate : -this.v.rate
    },
    animYVel: function(){
        this.v.diff.y = mg.abs(this.v.curr.y - this.v.temp.y)
        if(this.v.diff.y < this.v.rate){ this.v.curr.y = this.v.temp.y; this.v.isAnimating.y = false; return true; }
        this.v.curr.y += (this.v.curr.y < this.v.temp.y) ? this.v.rate : -this.v.rate
    },
    animZVel: function(){
        this.v.diff.z = mg.abs(this.v.curr.z - this.v.temp.z)
        if(this.v.diff.z < this.v.rate){ this.v.curr.z = this.v.temp.z; this.v.isAnimating.z = false; return true; }
        this.v.curr.z += (this.v.curr.z < this.v.temp.z) ? this.v.rate : -this.v.rate
    },

    //  Position Mods --------------------------------------------------------//
    ///////////////////////////////////////> = WIP =
    setXPos: function(val){
        this.pos.temp.x = val
    },
    setYPos: function(val){
        this.pos.temp.y = val
    },
    setZPos: function(val){
        this.pos.temp.z = val
    },
    setPos: function(x,y,z){
        this.setXPos(x);this.setYPos(y);this.setZPos(z)
    },
    checkPos: function(){
        if(this.m.position.x != this.pos.temp.x){ this.pos.isAnimating.x = true; this.animXPos(); }
        if(this.m.position.y != this.pos.temp.y){ this.pos.isAnimating.y = true; this.animYPos(); }
        if(this.m.position.z != this.pos.temp.z){ this.pos.isAnimating.z = true; this.animZPos(); }
    },
    animXPos: function(){
        this.pos.diff.x = mg.abs(this.m.position.x - this.pos.temp.x)
        if(this.pos.diff.x < this.v.curr.x){this.m.position.x = this.pos.temp.x;this.pos.isAnimating.x = false;return true;}
        this.m.position.x += (this.m.position.x < this.pos.temp.x) ? this.v.curr.x : -this.v.curr.x
    },
    animYPos: function(){
        this.pos.diff.y = mg.abs(this.m.position.y - this.pos.temp.y)
        if(this.pos.diff.y < this.v.curr.y){this.m.position.y = this.pos.temp.y;this.pos.isAnimating.y = false;return true;}
        this.m.position.y += (this.m.position.y < this.pos.temp.y) ? this.v.curr.y : -this.v.curr.y
    },
    animZPos: function(){
        this.pos.diff.z = mg.abs(this.m.position.z - this.pos.temp.z)
        if(this.pos.diff.z < this.v.curr.z){this.m.position.z = this.pos.temp.z;this.pos.isAnimating.z = false;return true;}
        this.m.position.z += (this.m.position.z < this.pos.temp.z) ? this.v.curr.z : -this.v.curr.z
    },

    // Rotation Mods -------------------------------------------------//
    ///////////////////////////////////////> = Current WIP =
    setXRot: function(val){
        if(val == 'continuous'){ this.r.continuous.x = 1; }else{ this.r.continuous.x = 0; }
        if(this.v.instant.x){this.m.rotation.x = this.r.temp.x = this.wrapRot(val); return true; }
        if(!isNaN(val)){ this.r.temp.x = this.wrapRot(val); }
    },
    setYRot: function(val){
        if(val == 'continuous'){ this.r.continuous.y = 1; }else{ this.r.continuous.y = 0; }
        if(this.v.instant.y){this.m.rotation.y = this.r.temp.y = this.wrapRot(val); return true; }
        if(!isNaN(val)){ this.r.temp.y = this.wrapRot(val); }
    },
    setZRot: function(val){
        if(val == 'continuous'){ this.r.continuous.z = 1; }else{ this.r.continuous.z = 0; }
        if(this.v.instant.z){this.m.rotation.z = this.r.temp.z = this.wrapRot(val); return true;}
        if(!isNaN(val)){ this.r.temp.z = this.wrapRot(val);}
    },
    setRot: function(x,y,z){
        this.setXRot(x);this.setYRot(y);this.setZRot(z)
    },
    wrapRot: function(val){
        if(val >= 0){
            while(val > this.r.max){ val -= this.r.max; }
            return val
        }else{
            while(val < -this.r.max){ val += this.r.max; }
            return val
        }
    },
    checkRot: function(){
        if(this.m.rotation.x != this.r.temp.x){ this.r.isAnimating.x = true; this.animXRot(); }else if(this.r.continuous.x == 1){ this.r.isAnimating.x = true; this.contXRot(); }
        if(this.m.rotation.y != this.r.temp.y){ this.r.isAnimating.y = true; this.animYRot(); }else if(this.r.continuous.y == 1){ this.r.isAnimating.y = true; this.contYRot(); }
        if(this.m.rotation.z != this.r.temp.z){ this.r.isAnimating.z = true; this.animZRot(); }else if(this.r.continuous.z == 1){ this.r.isAnimating.z = true; this.contZRot(); }
    },
    animXRot: function(){
        this.r.diff.x = mg.abs(this.m.rotation.x - this.r.temp.x)
        if(this.r.diff.x < this.v.curr.x){ this.m.rotation.x = this.r.temp.x; this.r.isAnimating.x = false; return true;}
        this.m.rotation.x += (this.m.rotation.x > this.r.temp.x) ? -this.v.curr.x : this.v.curr.x
    },
    animYRot: function(){
        this.r.diff.y = mg.abs(this.m.rotation.y - this.r.temp.y)
        if(this.r.diff.y < this.v.curr.y){this.m.rotation.y = this.r.temp.y;this.r.isAnimating.y = false;return true;}
        this.m.rotation.y += (this.m.rotation.y > this.r.temp.y) ? -this.v.curr.y : this.v.curr.y
    },
    animZRot: function(){
        this.r.diff.z = mg.abs(this.m.rotation.z - this.r.temp.z)
        if(this.r.diff.z < this.v.curr.z){this.m.rotation.z = this.r.temp.z;this.r.isAnimating.z = false;return true;}
        this.m.rotation.z += (this.m.rotation.z > this.r.temp.z) ? -this.v.curr.z : this.v.curr.z
    },
    contXRot: function(){
        this.m.rotation.x = this.r.temp.x = this.wrapRot(this.r.temp.x += this.v.curr.x)
    },
    contYRot: function(){
        this.m.rotation.y = this.r.temp.y = this.wrapRot(this.r.temp.y += this.v.curr.y)
    },
    contZRot: function(){
        this.m.rotation.z = this.r.temp.z = this.wrapRot(this.r.temp.z += this.v.curr.z)
    },
    //  Scale Mods --------------------------------------------------------//
    ///////////////////////////////////////> = WIP =
    modScale: function(amt = .01){
        this.s.temp.x += amt
        this.s.temp.y += amt
        this.s.temp.z += amt
    },
    setXScale: function(val){
        this.s.temp.x = val
    },
    setYScale: function(val){
        this.s.temp.y = val
    },
    setZScale: function(val){
        this.s.temp.z = val
    },
    setScale: function(x, y, z){
        this.setXScale(x)
        this.setYScale(y)
        this.setZScale(z)
    },
    checkScale: function(){
        if(this.m.scale.x != this.s.temp.x){this.s.isAnimating.x = true; this.animXScale();}
        if(this.m.scale.y != this.s.temp.y){this.s.isAnimating.y = true; this.animYScale();}
        if(this.m.scale.z != this.s.temp.z){this.s.isAnimating.z = true; this.animZScale();}
    },
    animXScale: function(){
        this.s.diff.x = mg.abs(this.m.scale.x - this.s.temp.x)
        if(this.s.diff.x < this.v.curr.x){ this.m.scale.x = this.s.temp.x; this.s.isAnimating.x = false; return true;}
        this.m.scale.x += (this.m.scale.x > this.s.temp.x) ? -this.v.curr.x : this.v.curr.x
    },
    animYScale: function(){
        this.s.diff.y = mg.abs(this.m.scale.y - this.s.temp.y)
        if(this.s.diff.y < this.v.curr.y){ this.m.scale.y = this.s.temp.y; this.s.isAnimating.y = false; return true;}
        this.m.scale.y += (this.m.scale.y > this.s.temp.y) ? -this.v.curr.y : this.v.curr.y
    },
    animZScale: function(){
        this.s.diff.z = mg.abs(this.m.scale.y - this.s.temp.z)
        if(this.s.diff.z < this.v.curr.z){ this.m.scale.z = this.s.temp.z; this.s.isAnimating.z = false; return true;}
        this.m.scale.z += (this.m.scale.z > this.s.temp.z) ? -this.v.curr.z : this.v.curr.z
    },
    //  Opacity Mods --------------------------------------------------------//
    ///////////////////////////////////////> = Review/Finished =
    setOpacity: function(o){
        if(o > 1 || o < 0){ return true; }
        this.o.temp = o
    },
    checkOpacity: function(){
        if(this.m.material.opacity != this.o.temp){ this.o.isAnimating = true; this.animOpacity(); }
    },
    animOpacity: function(){
        this.o.diff = mg.abs(this.m.material.opacity - this.o.temp)
        if(this.o.diff < this.o.rate){
            this.m.material.opacity = this.o.temp;this.o.isAnimating = false;return true;
        }
        this.m.material.opacity += (this.m.material.opacity > this.o.temp) ? -this.o.rate : this.o.rate
    },
    //////////////////////////////////////////////////////////////////////////
    // = Check All = -----------------------------------------------------///
    ////////////////////////
    checkAll: function(){
        this.checkVel()
        this.checkPos()
        this.checkRot()
        this.checkScale()
        this.checkOpacity()
    }
})
