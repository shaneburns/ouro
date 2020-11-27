import {ObjectBase} from './../core/objectBase.js'

export class CoreSphere extends ObjectBase{
    constructor(creation, settings){
        settings.texture = creation.texLoader.load(settings.texture ? settings.texture : "./../assets/textures/explosion.png")
        settings.complexity = settings.detail ?? 4
        settings.timeScale = settings.timeScale ?? 0.025
        settings.turbScale = 19.0
        settings.coreMat = new THREE.ShaderMaterial({
            uniforms: {
                tExplosion: { type: "t", value: settings.texture },
                time: {  type: "f",  value: 0.0 },
                turbScale: {type: "f", value: settings.turbScale}
            },
            vertexShader: coreVShader(),
            fragmentShader: coreFShader()
        })
        settings.body = new CANNON.Body({shape: new CANNON.Sphere(1), mass: 4})
        settings.model = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( .9, settings.complexity ), settings.coreMat )
        settings.mesh = new THREE.Object3D()
        super(creation, settings);

        this.model = settings.model
        this.mesh.add(this.model)
        this.model.position.x = .35 // offset x axis to match this.body position 
        this.texture = settings.texture.dispose()
        this.complexity = settings.complexity
        this.timeScale = settings.timeScale
        this.turbScale = settings.turbScale
        this.coreMat = settings.coreMat
    }
    updateTime(val){
        this.coreMat.uniforms[ 'time' ].value = val
    }
    updateTimeScale(val){
        this.timeScale = val
    }
    updateTexture(t){
        this.coreMat.uniforms['tExplosion'].value = this.texture = mg.tex.load(t)
    }
    updateTurbScale(val){
        this.coreMat.uniforms['turbScale'].value = this.turbScale = val
    }
    update(){
        this.updateTime(this.creation.tick * this.timeScale)
    }
}