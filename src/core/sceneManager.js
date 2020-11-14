class SceneManager {
    constructor(creation, options){
        this.creation = creation
        this.list = options.list ? options.list : []
        this.index = 0
        this.activeScene = null

        
    }
    render(){
        // call render method of active scene(s)
        this.activeScene.render()
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

export {SceneManager};