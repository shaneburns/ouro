/*
    SceneSkeleton Class
    Desc: Extendable class which creates a Context with access to a THREE.js Scene object and Camera object.
        Dirivitive classes can call super in the constructor class before adding things to the scene, and 
        then call the super.render() function in render after updating any movement or physics.
*/
class SceneSkeleton {
    constructor(creation){
        this.creation = creation
        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2( 0x202020, 0.025 );
        this.camera = new THREE.PerspectiveCamera(90, this.creation.canvas.width()/this.creation.canvas.height(), 0.1, 1000)
        window.addEventListener( 'resize', ()=>{
            this.setAspect()
        }, false )
    }

    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    start(){
        // :/ I don't know what to put here yet
        // What part of the scene would need to be started?
    }
    
    end(){

    }

    update(){
        
    }

    setAspect(){
        this.camera.aspect = this.creation.canvas.width() / this.creation.canvas.height()
        this.camera.updateProjectionMatrix()

        this.creation.renderer.setSize( this.creation.canvas.width(), this.creation.canvas.height() )
    }
    render(){
        this.update()
        this.creation.renderer.render(this.scene, this.camera)
    }

    // Dispose
    dispose(){
        // dereference everything
    }
}

export {SceneSkeleton};