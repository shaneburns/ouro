class SceneManager {
    constructor(creation, options){
        this.creation = creation
        this.sceneList = options.list ? options.list : []
        this.index = 0
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
        if(this.nextScene) this.nextScene = new this.nextScene()
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
        this.activeScene = this.sceneList[this.index]
        this.setNextScene()
    }
    render(){
        // call render method of active scene(s)
        this.activeScene.render()
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

export {SceneManager};