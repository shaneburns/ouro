const TestChamberBlock0 = sceneSetup.extend({
    init: function(canvas){
        this._super(canvas)
    },
    customCode: function(){
        //Override those global scene attributes
        this.blockNum = 0
        // Add Player
        this.player = new Player(this.camera)
        this.scene.add(this.player.m)

        // Add Chamber Block
        this.block = new Block0()
        this.scene.add(this.block.m)

        //----------------------------------------------------------------------
        // Lighting Setup
        this.lights = {}
        this.lights.ambient = new THREE.AmbientLight(0x000000, .8)
        this.scene.add(this.lights.ambient)



        this.canvas.el.classList.add('Block'+this.blockNum)
    },
    render: function(){
        // Update Tick
        mg.tick = mg.clock.getElapsedTime()
        mg.tickDelta = (mg.tick - mg.lastTick)
        mg.lastTick = mg.tick
        // Player
        this.player.update()
        // Chamber Block 0
        this.block.update()
        this._super()
    }
})
