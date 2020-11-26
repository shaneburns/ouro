import {SceneSkeleton} from './sceneSkeleton.js'
export class PlayableScene extends SceneSkeleton{
    constructor(creation, settings){
        super(creation, settings)
        this.player = null
    }
    update(){
        let inversePos = this.player.body.position.clone()
        inversePos = inversePos.scale(-1)
        this.scene.position.set(inversePos.x, inversePos.y, inversePos.z)
    }
}