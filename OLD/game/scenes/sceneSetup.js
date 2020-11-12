const sceneSetup = Class.extend({
    init: function(canvas){
        //----------------------------------------------------------------------
        // Scene/Camera Setup
        this.canvas = mg(canvas)
        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2( 0x202020, 0.025 );
        this.camera = new THREE.PerspectiveCamera(90, this.canvas.width()/this.canvas.height(), 0.1, 1000)
        //this.camera.position.set(0, 6, 10)

        //----------------------------------------------------------------------
        // your custom code

        this.customCode()// Throw anything you want in here(menus/ui stuff/a basic level layout for all levels)

        //----------------------------------------------------------------------
        // Renderer Setup
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.BasicShadowMap

        //----------------------------------------------------------------------
        // Apply Evenly across the visible area
        this.canvas.el.appendChild(this.renderer.domElement)
        this.setAspect()
        window.addEventListener( 'resize', ()=>{
            this.setAspect()
        }, false )
    },
    customCode: function(){
        // add custom code here that will effect all scenes
    },
    setAspect: function(){
        this.camera.aspect = this.canvas.width() / this.canvas.height()
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( this.canvas.width(), this.canvas.height() )
    },
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render: function(){
        // Render
        this.renderer.render(this.scene, this.camera)
    }
})
