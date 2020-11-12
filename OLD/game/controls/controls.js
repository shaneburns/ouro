const Controls = Class.extend({
    forward: false,
    left: false,
    right: false,
    backward: false,
    f: new THREE.Vector3(),
    keypressed: null,
    keyreleased: null,
    mousemove: null,
    pointerLock: null,
    hasPointerLock: 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document,
    pointerlockchange: null,
    pointerlockerror: null,
    element: null,
    init: function(camera){
        // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

			if ( this.hasPointerLock ) {
                this.pointerLock = new THREE.PointerLockControls(camera)
				this.element = document.body;

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
                            break;}}

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
                            break;}}

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
})
