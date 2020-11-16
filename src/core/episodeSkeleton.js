import {SceneManager} from './sceneManager'
class EpisodeSkeleton{
    constructor(creation, settings = {}){
        //---------------------------------------------------------
        // Members
        this.creation = creation
        this.name = settings.name ? settings.name : 'Episode'


        //---------------------------------------------------------
        // Managers
        this.sceneManager = settings.sceneManager ? settings.sceneManager : new SceneManager(this.creation) // Instantiate SceneManager
    }
    start(){
        this.sceneManager.start()
    }
    stop(){
        this.sceneManager.stop()
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    render(){
        this.sceneManager.render()
    }
}
export {EpisodeSkeleton};