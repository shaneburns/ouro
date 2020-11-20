class SceneManager {
    constructor(creation, settings = {}){
        this.creation = creation
        this.sceneList = settings.sceneList ? settings.sceneList : []
        this.index = settings.index ? settings.index : 0
        this.activeScene = null
        this.lastScene = null
        this.nextScene = null

        
    }
    iterateIndex(){
        this.index += 1
        return this.index
    }

    iterateScene(){
        this.lastScene = this.activeScene
        this.activeScene = this.nextScene
        this.setNextScene()
        this.iterateIndex()
        this.unloadLastScene()
    }
    setNextScene(index = this.index + 1){
        this.nextScene = this.sceneList[index]
    }
    loadNextScene(){
        if(this.nextScene) this.nextScene = new this.nextScene(this.creation)
    }
    unloadLastScene(){
        // call Destruct on Episode
        this.lastScene.dispose()
        this.lastScene = null
    }

    startActiveScene(){
        this.activeScene.start()
    }
    endActiveScene(){
        this.activeScene.stop()
        this.loadNextScene()
        this.iterateScene()
    }
    start(){
        this.activeScene = new this.sceneList[this.index](this.creation)
        this.setNextScene()
    }
    render(){
        // call render method of active scene(s)
        if(this.activeScene.render)this.activeScene.render()
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

export {SceneManager};