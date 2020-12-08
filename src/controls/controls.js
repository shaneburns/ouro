export class Controls {
    
    constructor(creation, camera, target){
        this.creation = creation
        this.camera = camera
        this.target = target
        this.forward = false
        this.left = false
        this.right = false
        this.backward = false
        this.jump = false
        this.canJump = true
        this.isJumping = false
        this.f = new THREE.Vector3()
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
                        this.forward = true
                        break
                    case 65:
                        this.left = true
                        break
                    case 83:
                        this.backward = true
                        break
                    case 68:
                        this.right = true
                        break;
                    case 32:
                        this.jump = true;
                        break;}};

            this.keyReleased = (e)=>{
                switch(e.keyCode){
                    case 87:
                        this.forward = false
                        break
                    case 65:
                        this.left = false
                        break
                    case 83:
                        this.backward = false
                        break
                    case 68:
                        this.right = false
                        break;
                    case 32:
                        this.jump = false;
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

        }
    }
    getForce(){
        this.f.multiplyScalar(0)
        // directional forces
        if(this.forward) this.f.z-=1;
        if(this.backward) this.f.z+=1;
        if(this.left) this.f.x-=1;
        if(this.right) this.f.x+=1;

        // Apply local rotation according to camera
        this.f.applyQuaternion(this.camera.quaternion);
        this.f.y = 0;// reset y for jump only
        // jump force
        if(this.jump) {
            if (!this.isJumping && this.canJump){
                this.isJumping = true
                setTimeout(()=>{
                    this.canJump = false
                    setTimeout(()=>{
                        this.canJump = true
                        this.isJumping = false
                    }, 1000)
                }, 200)
            }
            if(this.isJumping && this.canJump) this.f.y+=5
        }
        return this.f
    }
    update(){
        this.pointerLock.updateTimeElapsed(this.creation.tickDelta)
        this.pointerLock.update()
    }

}
