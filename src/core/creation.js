import {MenuManager} from './menuManager.js'
import {EpisodeManager} from './episodeManager.js'
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
        this.collmeshlist = [] // Collidable Mesh List for Collision Detection // Should be in a manager

        // Clock and Tick setup
        this.clock = new THREE.Clock()
        this.tick = this.clock.getElapsedTime()
        this.lastTick = this.tick
        this.tickDelta = null

        //---------------------------------------------------
        // Managers

        // Set or Instantiate a MenuManager
        this.menuManager = settings.menuManager ? settings.menuManager : new MenuManager(this)

        // Set or Instantiate EpisodeManager
        this.episodeManager = settings.episodeManager ? settings.episodeManager : new EpisodeManager(this)

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
        this.tick=this.clock.getElapsedTime()
        this.tickDelta = (this.tick - this.lastTick)
        this.lastTick = this.tick
    }

    start(){
        this.episodeManager.start()
        requestAnimationFrame(()=>this.render())
    }
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render(){
        

        // Update Tick
        this.tickUpdate()

        //mg.stats.begin()
        this.episodeManager.render()
        //mg.stats.end()

        window.requestAnimationFrame(()=>this.render())
    }
}

export {Creation};