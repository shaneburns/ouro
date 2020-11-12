const core = AutoAnimObj.extend({
    init: function(texture = "images/explosion.png", detail = 4, timeScale = .025){
        this._super()
        this.texture = mg.tex.load(texture)
        this.timeScale = timeScale
        this.turbScale = 9.0
        this.complexity = detail
        this.coreMat = new THREE.ShaderMaterial({
            uniforms: {
                tExplosion: { type: "t", value: this.texture },
                time: {  type: "f",  value: 0.0 },
                turbScale: {type: "f", value: this.turbScale}
            },
            vertexShader: document.getElementById('coreVShader').textContent,
            fragmentShader: document.getElementById('coreFShader').textContent
        })
        this.m = new THREE.Mesh( new THREE.IcosahedronGeometry( 1, this.complexity ), this.coreMat )
        this.setVel(this.v.max, this.v.max, this.v.max)
        this.shrink()
    },
    updateTime: function(val){
        this.coreMat.uniforms[ 'time' ].value = val
    },
    updateTimeScale: function(val){
        this.timeScale = val
    },
    updateTexture: function(t){
        this.coreMat.uniforms['tExplosion'].value = this.texture = mg.tex.load(t)
    },
    updateTurbScale: function(val){
        this.coreMat.uniforms['turbScale'].value = this.turbScale = val
    },
    grow: function(){
        this.setXPos(.35)
        this.setScale(1, 1, 1)
    },
    shrink: function(){
        this.setXPos(0)
        this.setScale(.1, .1, .1)
    },
    render: function(){
        this.checkAll()
        this.updateTime(mg.tick * this.timeScale)
    }
})
