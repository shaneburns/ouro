'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class MenuManager {

}

class EpisodeManager{
    constructor(creation, settings){
        //---------------------------------------------------------
        // Members
        this.creation = creation; // dependancy injection
        this.episodeList = settings.episodeList ? settings.episodeList : []; // a list of episodes to iterate through
        this.index =  0; // should be in save data that should be passed to the game or picked through the menu
        this.activeEpisode = null; // The current episode class being played
        this.nextEpisode = null; // should be bast on activeEpisode
        this.lastEpisode = null; // just for cleanup
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Getters

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Setters

    iterateIndex(){
        this.index += 1;
        return this.index
    }

    setActiveEpisode(){
        this.lastEpisode = this.activeEpisode;
        this.activeEpisode = this.nextEpisode;
        this.nextEpisode = this.episodeList[this.iterateIndex()];

        this.creation.renderer.add;

        this.unloadLastEpisode();
    }
    loadNextEpisode(){
        this.nextEpisode = new this.nextEpisode();
    }
    unloadLastEpisode(){
        // call Destruct on Episode
        this.lastEpisode.dispose();
        this.lastEpisode = null;
    }

    startActiveEpisode(){
        this.activeEpisode.SceneManager.start();
    }
    endActiveEpisode(){
        this.activeEpisode.SceneManager.stop();
    }
    render(){
        this.activeEpisode.render();
    }
}

/* Creation Class 
    Desc: This class is a base class to setup and act as a dependancy hub for canvas, renderer, tickDelta, etc

*/
class Creation {
    constructor(settings = {}){
        //---------------------------------------------------
        // Members
        this.canvas = settings.canvasId ? document.querySelector("#" + this.settings.canvasId) : document.body.appendChild(document.createElement("canvas"));
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = settings.shadowMapEnabled ? settings.shadowMapEnabled : true;
        if(this.render.shadowMap.enabled) this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.canvas.el.appendChild(this.renderer.domElement);


        this.mtlLoader = new THREE.MTLLoader(); // Material Loader
        this.objLoader = new THREE.OBJLoader(); // Object Loader
        this.texLoader = new THREE.TextureLoader; // Texture Loader
        this.collmeshlist = []; // Collidable Mesh List for Collision Detection // Should be in a manager

        // Clock and Tick setup
        this.clock = new THREE.Clock();
        this.tick = this.clock.getElapsedTime();
        this.lastTick = this.tick;
        this.tickDelta = null;

        //---------------------------------------------------
        // Managers

        // Set or Instantiate a MenuManager
        this.menuManager = settings.menuManager ? settings.menuManager : new MenuManager(this);

        // Set or Instantiate EpisodeManager
        this.episodeManager = settings.episodeManager ? settings.episodeManager : new EpisodeManager(this);

        // This is for frame rate stats
        // Commenting for now
        // if(stats){
        //     // Add Stats
        //     this.stats = new Stats()
        //     this.stats.showPanel(0)
        //     document.body.appendChild( this.stats.dom )
        // }

    }

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Getters

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Setters
    setMenuManager(menuManger){
        this.menuManager = menuManager;
    }
    setEpisodeManager(episodeManger){
        this.episodeManger = episodeManger;
    }


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    tickUpdate(){
        this.tick=this.clock.getElapsedTime();
        this.tickDelta = (this.tick - this.lastTick);
        this.lastTick = this.tick;
    }

    start(){
        requestAnimationFrame(this.render());
    }
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render(){
        requestAnimationFrame(this.render());

        // Update Tick
        this.tickUpdate();

        //mg.stats.begin()
        this.episodeManager.render();
        //mg.stats.end()

    }
}

class SceneManager {
    constructor(creation, options){
        this.creation = creation;
        this.list = options.list ? options.list : [];
        this.index = 0;
        this.activeScene = null;

        
    }
    render(){
        // call render method of active scene(s)
        this.activeScene.render();
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

class EpisodeSkeleton{
    constructor(creation, settings){
        //---------------------------------------------------------
        // Members
        this.creation = creation;
        this.name = settings.name ? settings.name : 'Episode';


        //---------------------------------------------------------
        // Managers
        this.sceneManager = settings.sceneManager ? settings.sceneManager : new SceneManager(this.creation); // Instantiate SceneManager
    }
    render(){
        this.sceneManager.render();
    }
}

/*
    SceneSkeleton Class
    Desc: Extendable class which creates a Context with access to a THREE.js Scene object and Camera object.
        Dirivitive classes can call super in the constructor class before adding things to the scene, and 
        then call the super.render() function in render after updating any movement or physics.
*/
class SceneSkeleton {
    constructor(creation){
        this.creation = creation;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x202020, 0.025 );
        this.camera = new THREE.PerspectiveCamera(90, this.creation.canvas.width()/this.creation.canvas.height(), 0.1, 1000);
        window.addEventListener( 'resize', ()=>{
            this.setAspect();
        }, false );
    }
    setAspect(){
        this.camera.aspect = this.creation.canvas.width() / this.creation.canvas.height();
        this.camera.updateProjectionMatrix();

        this.creation.renderer.setSize( this.creation.canvas.width(), this.creation.canvas.height() );
    }
    render(){
        this.creation.renderer.render(this.scene, this.camera);
    }
}

exports.Creation = Creation;
exports.EpisodeManager = EpisodeManager;
exports.EpisodeSkeleton = EpisodeSkeleton;
exports.MenuManager = MenuManager;
exports.SceneManager = SceneManager;
exports.SceneSkeleton = SceneSkeleton;
