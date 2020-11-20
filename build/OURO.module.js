class MenuManager {

}

class EpisodeManager{
    constructor(creation, settings = {}){
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


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    start(){
        this.activeEpisode = new this.episodeList[this.index](this.creation);
        this.startActiveEpisode();
    }
    pause(){

    }
    stop(){

    }
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
        this.nextEpisode = new this.nextEpisode(this.creation);
    }
    unloadLastEpisode(){
        // call Destruct on Episode
        this.lastEpisode.dispose();
        this.lastEpisode = null;
    }

    startActiveEpisode(){
        this.activeEpisode.start();
    }
    endActiveEpisode(){
        this.activeEpisode.stop();
    }
    render(){
        this.activeEpisode.render();
    }
}

//import * as Stats from './../../node_modules/stats-js/build/stats.js'
/* Creation Class 
    Desc: This class is a base class to setup and act as a dependancy hub for canvas, renderer, tickDelta, etc

*/
class Creation {
    constructor(settings = {}){
        //---------------------------------------------------
        // Members
        this.canvas = settings.canvasId ? document.querySelector("#" + settings.canvasId) : document.body;
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.shadowMap.enabled = settings.shadowMapEnabled ? settings.shadowMapEnabled : true;
        if(this.renderer.shadowMap.enabled) this.renderer.shadowMap.type = THREE.BasicShadowMap;
        


        // this.mtlLoader = new THREE.MTLLoader() // Material Loader
        // this.objLoader = new THREE.OBJLoader() // Object Loader
        // this.texLoader = new THREE.TextureLoader // Texture Loader
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
        // if(settings.stats){
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
    setMenuManager(menuManager){
        this.menuManager = menuManager;
    }
    setEpisodeManager(episodeManger){
        this.episodeManager = episodeManger;
    }


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    tickUpdate(){
        this.tick=this.clock.getElapsedTime();
        this.tickDelta = (this.tick - this.lastTick);
        this.lastTick = this.tick;
    }

    start(){
        this.episodeManager.start();
        requestAnimationFrame(()=>this.render());
    }
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render(){
        

        // Update Tick
        this.tickUpdate();

        //mg.stats.begin()
        this.episodeManager.render();
        //mg.stats.end()

        window.requestAnimationFrame(()=>this.render());
    }
}

class SceneManager {
    constructor(creation, settings = {}){
        this.creation = creation;
        this.sceneList = settings.sceneList ? settings.sceneList : [];
        this.index = settings.index ? settings.index : 0;
        this.activeScene = null;
        this.lastScene = null;
        this.nextScene = null;

        
    }
    iterateIndex(){
        this.index += 1;
        return this.index
    }

    iterateScene(){
        this.lastScene = this.activeScene;
        this.activeScene = this.nextScene;
        this.setNextScene();
        this.iterateIndex();
        this.unloadLastScene();
    }
    setNextScene(index = this.index + 1){
        this.nextScene = this.sceneList[index];
    }
    loadNextScene(){
        if(this.nextScene) this.nextScene = new this.nextScene(this.creation);
    }
    unloadLastScene(){
        // call Destruct on Episode
        this.lastScene.dispose();
        this.lastScene = null;
    }

    startActiveScene(){
        this.activeScene.start();
    }
    endActiveScene(){
        this.activeScene.stop();
        this.loadNextScene();
        this.iterateScene();
    }
    start(){
        this.activeScene = new this.sceneList[this.index](this.creation);
        this.setNextScene();
    }
    render(){
        // call render method of active scene(s)
        if(this.activeScene.render)this.activeScene.render();
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

class EpisodeSkeleton{
    constructor(creation, settings = {}){
        //---------------------------------------------------------
        // Members
        this.creation = creation;
        this.name = settings.name ? settings.name : 'Episode';


        //---------------------------------------------------------
        // Managers
        this.sceneManager = settings.sceneManager ? settings.sceneManager : new SceneManager(this.creation); // Instantiate SceneManager
    }
    nextScene(){
        this.sceneManager.loadNextScene();
        this.sceneManager.iterateScene();
    }
    goToScene(sceneIndex){
        this.sceneManager.index = sceneIndex;
        this.sceneManager.setNextScene(sceneIndex);
        this.nextScene();
    }
    start(){
        this.sceneManager.start();
    }
    stop(){
        this.sceneManager.stop();
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
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
        
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase;

    }

    add(obj){
        this.scene.add(obj.mesh);
        this.world.addBody(obj.body);
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

//import * as CANNON from './../../node_modules/cannon/build/cannon.js'

class objectBase {
    constructor(creation, settings = {}){
        this.creation = creation;
        this.mtl = settings.mtl ?? null;
        this.geo = settings.geo ?? null;
        this.mesh = settings.mesh ?? new THREE.Mesh(this.geo, this.mtl);
        this.body = settings.body ?? new CANNON.Body({mass: settings.mass ?? 1, shape: settings.shape ?? null});
        
        
    }
    updatePosition(){
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

class basicCube extends objectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), mass: 4}),
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(0.5, 0.5, 0.5), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings);
    }
}

export { Creation, EpisodeManager, EpisodeSkeleton, MenuManager, SceneManager, SceneSkeleton, basicCube, objectBase };
