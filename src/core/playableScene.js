import {SceneSkeleton} from './sceneSkeleton.js'
export class PlayableScene extends SceneSkeleton{
    constructor(creation, settings){
        super(creation, settings)
        this.player = null
    }
    update(){
        let t = 1.0 - Math.pow(0.001, this.creation.tickDelta)
        let inversePos = this.player.body.position.clone()
        inversePos = inversePos.scale(-1)
        this.scene.position.lerp(new THREE.Vector3(inversePos.x, inversePos.y, inversePos.z), t)
    }
}