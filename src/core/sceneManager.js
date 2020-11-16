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

        this.unloadLastScene()
    }
    setNextScene(){
        this.nextScene = this.sceneList[this.iterateIndex()]
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
    endaAtiveScene(){
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
        this.activeScene.render()
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

export {SceneManager};