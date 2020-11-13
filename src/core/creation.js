import {SceneManager} from './sceneManager.js'

class Creation {
    // accept menu
    // accept 'scene' manager
    // handle rendering
    // handle controls?
    constructor(){
        this.mtlLoader = new THREE.MTLLoader() // Material Loader
        this.objLoader = new THREE.OBJLoader() // Object Loader
        this.texLoader = new THREE.TextureLoader // Texture Loader
        this.collmeshlist = [] // Collidable Mesh List for Collision Detection

        // Clock and Tick
        this.clock = new THREE.Clock()
        this.tick = this.clock.getElapsedTime()
        this.tickUpdate = () => {
            this.tick=this.clock.getElapsedTime()
            this.tickDelta = (this.tick - this.lastTick)
            this.lastTick = this.tick
        }
        this.lastTick = mg.tick
        this.tickDelta = null


        // This is for frame rate stats
        // Commenting for now
        // if(stats){
        //     // Add Stats
        //     this.stats = new Stats()
        //     this.stats.showPanel(0)
        //     document.body.appendChild( this.stats.dom )
        // }

        // Instantiate SceneManager (TODO: this should be for 'levels')
        // this.sceneManager = new SceneManager()

        // Start game/create game reference:)
        // Just call the first scene for testing
        // Will Need to add the critical game loop....later
        mg.game = new TestChamberBlock0('.gameCanvas')
    }
    tickUpdate(){
        this.tick=this.clock.getElapsedTime()
        this.tickDelta = (this.tick - this.lastTick)
        this.lastTick = this.tick
    }

    start(){
        requestAnimationFrame(this.render())
    }

    // Render
    render(){
        // Update Tick
        this.tickUpdate()

        //mg.stats.begin()
        this.sceneManager.render()
        //mg.stats.end()

        requestAnimationFrame(this.render())
    }
}

export {Creation};