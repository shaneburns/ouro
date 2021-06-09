export class BaseControls {
    
    constructor(creation, settings = {}){
        this.creation = creation
        this.target = settings.target ?? null
        this.forward = false
        this.left = false
        this.right = false
        this.backward = false
        this.jump = false
        this.canJump = settings.canJump ?? true
        this.isJumping = false
        this.f = new THREE.Vector3()
        // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    }
    goForward(impulse){
        this.forward = impulse
    }
    goBackward(impulse){
        this.backward = impulse
    }
    goLeft(impulse){
        this.left = impulse
    }
    goRight(impulse){
        this.right = impulse
    }
    jumpUp(impulse){
        this.jump = impulse
    }
    applyDirection(){
        this.target ? this.f.applyQuaternion(this.target.quaternion) : console.log('no target to quatern');
    }
    applyJumpForce(){
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
    }
    getForce(){
        this.f.multiplyScalar(0)
        // directional forces
        if(this.forward) this.f.z-=1;
        if(this.backward) this.f.z+=1;
        if(this.left) this.f.x-=1;
        if(this.right) this.f.x+=1;

        // Apply local rotation according to camera
        this.applyDirection()
        this.f.y = 0;// reset y for jump only
        // jump force
        this.applyJumpForce()
        return this.f
    }
}