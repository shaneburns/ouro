import { BaseControls } from "./baseControls"
// PointerLockControls
export class Controls extends BaseControls{
    
    constructor(creation, camera, target){
        super(creation)
        this.camera = camera
        this.target = target
        this.keypressed = null
        this.keyreleased = null
        this.mousemove = null
        this.pointerLock = null
        this.hasPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document,
        this.pointerlockchange = null
        this.pointerlockerror = null
        this.element = null
        // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

        if ( this.hasPointerLock ) {
            this.element = document.body;
            this.pointerLock = new THREE.PointerLockOrbitControls(this.camera, this.target, this.creation.tickDelta, this.element)

            this.pointerlockchange = ( event )=>{
                if ( document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element ) {
                    this.pointerLock.enabled = true
                } else {
                    this.pointerLock.enabled = false
                }
            }

            this.pointerlockerror = function ( event ) {
                // Handle it
            }

            this.keyPressed = (e)=>{
                switch(e.keyCode){
                    case 87:
                        this.goForward(true)
                        break
                    case 65:
                        this.goLeft(true)
                        break
                    case 83:
                        this.goBackward(true)
                        break
                    case 68:
                        this.goRight(true)
                        break;
                    case 32:
                        this.jumpUp(true)
                        break;}};

            this.keyReleased = (e)=>{
                switch(e.keyCode){
                    case 87:
                        this.goForward(false)
                        break
                    case 65:
                        this.goLeft(false)
                        break
                    case 83:
                        this.goBackward(false)
                        break
                    case 68:
                        this.goRight(false)
                        break;
                    case 32:
                        this.jumpUp(false)
                        break;}};

            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', this.pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', this.pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', this.pointerlockchange, false );

            document.addEventListener( 'pointerlockerror', this.pointerlockerror, false );
            document.addEventListener( 'mozpointerlockerror', this.pointerlockerror, false );
            document.addEventListener( 'webkitpointerlockerror', this.pointerlockerror, false );

            this.element.addEventListener( 'click', ( event )=>{
                // Ask the browser to lock the pointer
                this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
                this.element.requestPointerLock();

            }, false );

            // Listen for Key Events
            window.addEventListener('keydown', this.keyPressed)
            window.addEventListener('keyup', this.keyReleased)

        } else {

            //instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
            //this.creation.throwError('Your browser doesn\'t seem to support Pointer Lock API')
        }
    }
    applyDirection(){
        this.f.applyQuaternion(this.camera.quaternion);
    }
    update(){
        this.pointerLock.updateTimeElapsed(this.creation.tickDelta)
        this.pointerLock.update()
    }

}
