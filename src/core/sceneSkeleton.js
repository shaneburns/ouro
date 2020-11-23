/*
    SceneSkeleton Class
    Desc: Extendable class which creates a Context with access to a THREE.js Scene object and Camera object.
        Dirivitive classes can call super in the constructor class before adding things to the scene, and 
        then call the super.render() function in render after updating any movement or physics.
*/
class SceneSkeleton {
    constructor(creation, settings = {}){
        this.creation = creation;

        // THREE
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x202020, 0.025 );
        this.camera = new THREE.PerspectiveCamera(90, this.creation.canvas.clientWidth/this.creation.canvas.clientHeight, 0.1, 1000);
        
        this.setAspect();
        window.addEventListener( 'resize', ()=>{
            this.setAspect();
        }, false );

        // CANNON
        
        this.world = new CANNON.World()
        this.world.gravity.set(0, -9.82, 0)
        this.world.broadphase = new CANNON.NaiveBroadphase
        this.debugrenderer = new THREE.CannonDebugRenderer(this.scene, this.world)
    }

    add(obj){
        this.scene.add(obj.mesh)
        this.world.addBody(obj.body)
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
        this.camera.aspect = this.creation.canvas.clientWidth/ this.creation.canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        this.creation.renderer.setSize( this.creation.canvas.clientWidth, this.creation.canvas.clientHeight );
    }
    render(){
        this.update();
        this.world.step(1.0/60.0,this.creation.tickDelta,3);
        this.creation.renderer.render(this.scene, this.camera);
    }

    // Dispose
    dispose(){
        // dereference everything
        this.scene = null;
        this.camera = null;
        this.render = null;
        
    }
}

export {SceneSkeleton};