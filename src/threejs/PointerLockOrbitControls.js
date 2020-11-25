THREE.PointerLockOrbitControls = function ( camera, target, timeElapsed, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.PointerLockOrbitControls: The second parameter "domElement" is now mandatory.' );
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;

	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	this.minPolarAngle = Math.PI / 2 - Math.PI/8; // radians
	this.maxPolarAngle = Math.PI / 2 + Math.PI/8; // radians

	//
	// internals
	//

	var scope = this;

	var subject = new THREE.Object3D()
	subject.position.copy(OURO.Utils.getCenterPoint(target))
	target.add(subject)

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };
	var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
	var positionOffset = new THREE.Vector3(-4, 3, -5);
	var lookAtOffset = new THREE.Vector3(0, 2, 20);

	var currentPostion = new THREE.Vector3();
	var currentLookAt = new THREE.Vector3();

	var currtimeElapsed = timeElapsed;

	var PI_2 = Math.PI / 2;

	var vec = new THREE.Vector3();

	this.updateTimeElapsed = function(newTimeElapsed){
		currtimeElapsed = newTimeElapsed
		subject.position.copy(OURO.Utils.getCenterPoint(target))
	}
	this.update = function(){
		var idealOffset = calculateIdealOffset();
		var idealLookAt = calculateIdealLookAt();

		var t = 1.0 - Math.pow(0.001, currtimeElapsed)
		currentPostion.lerp(idealOffset, t);
		currentLookAt.lerp(idealLookAt, t);

		camera.position.copy(currentPostion);
		camera.lookAt(currentLookAt);
	}

	function calculateIdealOffset(){
		const idealOffset = positionOffset.clone();
		idealOffset.applyEuler(subject.rotation);
		idealOffset.add(subject.position);
		return idealOffset;
	}

	function calculateIdealLookAt(){
		const idealLookAt = lookAtOffset.clone();
		idealLookAt.applyEuler(subject.rotation);
		idealLookAt.add(subject.position);
		return idealLookAt;
	}

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.copy( subject.rotation );

		euler.y -= movementX * .002;
		euler.x += movementY * -.002;

		euler.x = Math.max( PI_2 - scope.maxPolarAngle, Math.min( PI_2 - scope.minPolarAngle, euler.x ) );
		
		subject.rotation.copy(euler)
		
		scope.dispatchEvent( changeEvent );

	}

	function onPointerlockChange() {

		if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockOrbitControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return camera;

	};

	this.getDirection = function () {

		var direction = new THREE.Vector3( 0, 0, - 1 );

		return function ( v ) {

			return v.copy( direction ).applyQuaternion( camera.quaternion );

		};

	}();

	this.moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn( camera.matrix, 0 );

		vec.crossVectors( camera.up, vec );

		camera.position.addScaledVector( vec, distance );

	};

	this.moveRight = function ( distance ) {

		vec.setFromMatrixColumn( camera.matrix, 0 );

		camera.position.addScaledVector( vec, distance );

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		scope.domElement.ownerDocument.exitPointerLock();

	};

	this.connect();

};

THREE.PointerLockOrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PointerLockOrbitControls.prototype.constructor = THREE.PointerLockOrbitControls;