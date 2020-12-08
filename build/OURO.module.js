class ObjectBase {
    constructor(creation, settings = {}){
        this.creation = creation;
        this.mtl = settings.mtl ?? null;
        this.geo = settings.geo ?? null;
        this.mesh = settings.mesh ?? new THREE.Mesh(this.geo, this.mtl);
        this.body = settings.body ?? new CANNON.Body({mass: settings.mass ?? 1, shape: settings.shape ?? null});
        
        
    }
    updatePosition(){
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

}

class BasicCube extends ObjectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), mass: 4}),
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshToonMaterial({ color: 0x50a8f0 }) )
    }){
        super(creation, settings);
    }
}

class BasicSphere extends ObjectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: new CANNON.Sphere(1), mass: 4}),
        mesh: new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings);
        this.mesh.castShadow = true;
        this.mesh.recieveShadow = false;
    }
}

class BasicTorus extends ObjectBase{
    constructor(creation, settings = {
        body: new CANNON.Body({shape: CANNON.Trimesh.createTorus(5, 1, 16, 16), mass: 1}),
        mesh: new THREE.Mesh(new THREE.TorusBufferGeometry(5, 1, 16, 16), new THREE.MeshToonMaterial({color: 0x50a8f0}) )
    }){
        super(creation, settings); 
    }
}

class RestGoal extends YUKA.Goal{
    
    constructor(owner){
        super(owner);
        console.log("RestGoal constructing");
        
        this.REST = 'REST';
        
        this.PLACEHOLDER = '-';
    }
    //need three things, Activate, Execute, and Terminate

    //Activate
    activate() {
        console.log("RestGoal activated");
        // this.owner.ui.currentGoal.textContent = this.REST;
        // this.owner.ui.currentSubgoal.textContent = this.PLACEHOLDER;
    }

    //Execute
    execute() {
        const owner = this.owner;
        
        console.log("RestGoal executing");
        owner.currentTime += owner.deltaTime;
        console.log("current time = "+owner.currentTime);
        console.log("rest duration = "+owner.restDuration);
        if (owner.currentTime >= owner.restDuration){
            this.status = YUKA.Goal.STATUS.COMPLETED;
            console.log("REST GOAL COMPLETED = "+ this.status);
        }
        console.log("RestGoal executed");

    }

    //Terminate
    terminate() {
        const owner = this.owner;
        owner.currentTime = 0;
        owner.fatigueLevel = 0;
    }
}

class RestEvaluator extends YUKA.GoalEvaluator{

    calculateDesirability( bee ) {
        console.log("calculating Rest desirability ");
        
        console.log("rest desireability = bee.tired = " + bee.tired());
        return (bee.tired() === true ) ? 1 : 0;
    }

    setGoal( bee ){
        const currentSubgoal = bee.brain.currentSubgoal();
        console.log("setting rest Goal");

		if ( ( currentSubgoal instanceof RestGoal ) === false ) {

			bee.brain.clearSubgoals();

            bee.brain.addSubgoal( new RestGoal( bee ) );
            console.log("subgoals cleared and new subgoal = restGoal");

		}

	}

}

class GatherGoal extends YUKA.CompositeGoal{
    constructor(owner){
        super(owner);
		
		this.GATHER = 'GATHER';
		
	//	this.inverseMatrix = new YUKA.Matrix4();
		this.localPosition = new YUKA.Vector3();
		
    }

    activate(){
		//this.ui.currentGoal.textContent = this.GATHER;
		console.log('INVERSEmat');
		//console.log(this.inverseMatrix);
        this.addSubgoal( new FindNextCollectibleGoal( this.owner ) );
        this.addSubgoal( new SeekToCollectibleGoal( this.owner ) );
		this.addSubgoal( new PickUpCollectibleGoal( this.owner ) );
	}

	execute() {

		this.status = this.executeSubgoals();

		this.replanIfFailed();

	}

}

//Find next collectible Goal
class FindNextCollectibleGoal extends YUKA.Goal {

	constructor( owner ) {

		super(owner);
		
		this.FIND_NEXT = 'FIND NEXT';
		console.log('INVERSEmatty');
		//console.log(inversyMatrix);

		this.inverseMatrix = new YUKA.Matrix4();
		console.log(new YUKA.Matrix4());
		console.log('///////////////////////');
        this.localPosition = new YUKA.Vector3();
		this.animationId = null;
		console.log('Owner Constructor');
		console.log(this.owner);

	}

	activate() {
		const owner = this.owner;
		console.log('Owner Activation');
		console.log(owner);

		// update UI

		// owner.ui.currentSubgoal.textContent = this.FIND_NEXT;

		// select closest collectible

		const entities = owner.manager.entities;
		let minDistance = Infinity;

		for ( let i = 0, l = entities.length; i < l; i ++ ) {

			const entity = entities[ i ];

			if ( entity !== owner ) {

				const squaredDistance = owner.position.squaredDistanceTo( entity.position );

				if ( squaredDistance < minDistance ) {

					minDistance = squaredDistance;
					owner.currentTarget = entity;

				}

			}

		}

		// determine if the bee should perform a left or right turn in order to face
		// the collectible
		

		owner.updateWorldMatrix();
		
		owner.worldMatrix.getInverse(this.inverseMatrix );
		
		this.localPosition.copy( owner.currentTarget.position ).applyMatrix4( this.inverseMatrix );
		
		//this.turn.reset().fadeIn( owner.crossFadeDuration );
		console.log("Owner Activation ended");

	}

	execute() {

		const owner = this.owner;
		console.log("Find Next Collectible Executing...");

		if ( owner.currentTarget !== null ) {

			if ( owner.rotateTo( owner.currentTarget.position, owner.deltaTime ) === true ) {

				this.status = YUKA.Goal.STATUS.COMPLETED;

			}

		} else {

			this.status = YUKA.Goal.STATUS.FAILED;

		}
		console.log("Find Next Collectible Executed");

	}

	terminate() {
		const owner = this.owner;
		console.log("Find Next Collectible Terminated");

    		

	}

}

//
//Seek the goal
class SeekToCollectibleGoal extends YUKA.Goal {

	constructor( owner ) {

		super(owner);
		console.log("Seek To Collectible Goal constructing");
        
        this.SEEK = 'SEEK';
        this.PICK_UP = 'PICK UP';
        this.PLACEHOLDER = '-';

        this.WALK = 'WALK';
        this.RIGHT_TURN = 'RIGHT_TURN';
        this.LEFT_TURN = 'LEFT_TURN';
        this.IDLE = 'IDLE';

        this.inverseMatrix = new YUKA.Matrix4();
        this.localPosition = new YUKA.Vector3();
		

    }
    activate() {

		const owner = this.owner;
		console.log("seeking collectible activating");

		// update UI

		// owner.ui.currentSubgoal.textContent = this.SEEK;

		//

		if ( owner.currentTarget !== null ) {

			const arriveBehavior = owner.steering.behaviors[ 0 ];
			arriveBehavior.target = owner.currentTarget.position;
			arriveBehavior.active = true;

		} else {

			this.status = YUKA.Goal.STATUS.FAILED;

		}

		//
		
		console.log("seeking collectible activated");


	}
	execute() {
		console.log("seeking collectible executing");

		if ( this.active() ) {

			const owner = this.owner;

			const squaredDistance = owner.position.squaredDistanceTo( owner.currentTarget.position );

			if ( squaredDistance < 0.25 ) {

				this.status = YUKA.Goal.STATUS.COMPLETED;

			}

			// adjust animation speed based on the actual velocity of the bee

		}
		console.log("seeking collectible executed");

	}

	terminate() {
		console.log("seeking collectible terminating");

		const arriveBehavior = this.owner.steering.behaviors[ 0 ];
		arriveBehavior.active = false;
		this.owner.velocity.set( 0, 0, 0 );

		//

		const owner = this.owner;
		console.log("seeking collectible terminated");

		//stop bee flying

	}

}
//now for the final, collect pollen
class PickUpCollectibleGoal extends YUKA.Goal {

	constructor( owner ) {

		super(owner);
		
		console.log("Picking up collectible goal constructing");
        this.REST = 'REST';
        this.GATHER = 'GATHER';
        this.FIND_NEXT = 'FIND NEXT';
        this.SEEK = 'SEEK';
        this.PICK_UP = 'PICK UP';
        this.PLACEHOLDER = '-';

        this.WALK = 'WALK';
        this.RIGHT_TURN = 'RIGHT_TURN';
        this.LEFT_TURN = 'LEFT_TURN';
        this.IDLE = 'IDLE';

        this.inverseMatrix = new YUKA.Matrix4();
        this.localPosition = new YUKA.Vector3();

		this.collectibleRemoveTimeout = 3; // the time in seconds after a collectible is removed

    }

	activate() {

		const owner = this.owner;
		
		console.log("Picking up collectible goal activating");

		// owner.ui.currentSubgoal.textContent = this.PICK_UP;

		//const gather = owner.animations.get( this.GATHER );
		//gather.reset().fadeIn( owner.crossFadeDuration );
		
		console.log("Picking up collectible goal activated");

	}

	execute() {

		const owner = this.owner;
		
		console.log("Picking up collectible goal executing");
		owner.currentTime += owner.deltaTime;

		console.log("current time = "+ owner.currentTime);
		console.log("pickupDuration = " + owner.pickUpDuration);

		if ( owner.currentTime >= owner.pickUpDuration ) {

			this.status = YUKA.Goal.STATUS.COMPLETED;
            
		} else if ( owner.currentTime >= this.collectibleRemoveTimeout ) {
			
			

			if ( owner.currentTarget !== null ) {

				owner.sendMessage( owner.currentTarget, 'PickedUp' );
				owner.currentTarget = null;

			}
		}

		
		console.log("Picking up collectible goal executed");

	}

	terminate() {

		const owner = this.owner;
		
		console.log("Picking up collectible goal terminating");

		owner.currentTime = 0;
		owner.fatigueLevel ++;
		
		console.log("Picking up collectible goal terminated");

		

	}

}

class GatherEvaluator extends YUKA.GoalEvaluator {

	calculateDesirability() {
		console.log("gathergoal desirability = 0.5");

		return 0.5;

	}

	setGoal( bee ) {

		const currentSubgoal = bee.brain.currentSubgoal();
		console.log("gatherGoal setting in gather evaluator");

		if ( ( currentSubgoal instanceof GatherGoal ) === false ) {

			bee.brain.clearSubgoals();
			console.log("clearing subgoals since current subgoal is false");
			

			bee.brain.addSubgoal( new GatherGoal( bee ) );
			console.log("new gathergoal added to subgoal");

		}

	}

}

//Now for the bee class
class Bee extends YUKA.Vehicle{
    constructor(mixer){
		super();
		
        this.maxTurnRate = Math.PI * 0.5;
		this.maxSpeed = 1.5;

        this.mixer = mixer;
        this.ui = {
			// currentGoal: document.getElementById( 'currentGoal' ),
			// currentSubgoal: document.getElementById( 'currentSubgoal' )
		};
		
        this.brain = new YUKA.Think( this );

		this.brain.addEvaluator( new RestEvaluator() );
        this.brain.addEvaluator( new GatherEvaluator() );
        // steering

		const arriveBehavior = new YUKA.ArriveBehavior();
		arriveBehavior.deceleration = 1.5;
		this.steering.add( arriveBehavior );

		//

		this.fatigueLevel = 0; // current level of fatigue
		this.restDuration = 5; //  duration of a rest phase in seconds
		this.pickUpDuration = 6; //  duration of a pick phase in seconds
		this.crossFadeDuration = 0.5; // duration of a crossfade in seconds
		this.currentTarget = null; // current collectible

		this.currentTime = 0; // tracks the current time of an action
		this.deltaTime = 0; // the current time delta value
		//this.position = new Vector3(0, 1, 0)

		this.MAX_FATIGUE = 3; // the girl needs to rest if this amount of fatigue is reached

		console.log(this);
		console.log(1);
	}

	update( delta ) {

		super.update( delta );

		this.deltaTime = delta;

		this.brain.execute();

		this.brain.arbitrate();

		//this.mixer.update( delta );

	}

	tired() {

		return ( this.fatigueLevel >= this.MAX_FATIGUE );

	}

}

class Controls {
    
    constructor(creation, camera, target){
        this.creation = creation;
        this.camera = camera;
        this.target = target;
        this.forward = false;
        this.left = false;
        this.right = false;
        this.backward = false;
        this.jump = false;
        this.canJump = true;
        this.isJumping = false;
        this.f = new THREE.Vector3();
        this.keypressed = null;
        this.keyreleased = null;
        this.mousemove = null;
        this.pointerLock = null;
        this.hasPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document,
        this.pointerlockchange = null;
        this.pointerlockerror = null;
        this.element = null;
        // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

        if ( this.hasPointerLock ) {
            this.element = document.body;
            this.pointerLock = new THREE.PointerLockOrbitControls(this.camera, this.target, this.creation.tickDelta, this.element);

            this.pointerlockchange = ( event )=>{
                if ( document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element ) {
                    this.pointerLock.enabled = true;
                } else {
                    this.pointerLock.enabled = false;
                }
            };

            this.pointerlockerror = function ( event ) {
                // Handle it
            };

            this.keyPressed = (e)=>{
                switch(e.keyCode){
                    case 87:
                        this.forward = true;
                        break
                    case 65:
                        this.left = true;
                        break
                    case 83:
                        this.backward = true;
                        break
                    case 68:
                        this.right = true;
                        break;
                    case 32:
                        this.jump = true;
                        break;}};

            this.keyReleased = (e)=>{
                switch(e.keyCode){
                    case 87:
                        this.forward = false;
                        break
                    case 65:
                        this.left = false;
                        break
                    case 83:
                        this.backward = false;
                        break
                    case 68:
                        this.right = false;
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
            window.addEventListener('keydown', this.keyPressed);
            window.addEventListener('keyup', this.keyReleased);

        }
    }
    getForce(){
        this.f.multiplyScalar(0);
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
                this.isJumping = true;
                setTimeout(()=>{
                    this.canJump = false;
                    setTimeout(()=>{
                        this.canJump = true;
                        this.isJumping = false;
                    }, 1000);
                }, 200);
            }
            if(this.isJumping && this.canJump) this.f.y+=5;
        }
        return this.f
    }
    update(){
        this.pointerLock.updateTimeElapsed(this.creation.tickDelta);
        this.pointerLock.update();
    }

}

class Character extends ObjectBase{
    constructor(creation, camera, settings = {
        body: new CANNON.Body({shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), mass: 5}),
        mesh: new THREE.Object3D()
    }){
        super(creation, settings);
        this.mesh.add(camera);
        camera.position.set(0, 5, -3);

        this.speed = 20;
        this.model = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
        this.mesh.add(this.model);
        this.controls = new Controls(camera);

        // Add a line mesh to visulaize the velocity vectors length/direction
        // for testing
        this.vMagLine = {geom: new THREE.Geometry(),mat: new THREE.LineBasicMaterial({color: 0xff0000 }),m:null};
        this.vMagLine.geom.vertices.push( new THREE.Vector3(), this.body.velocity);
        this.vMagLine.geom.verticesNeedUpdate = true;
        this.vMagLine.m = new THREE.Line( this.vMagLine.geom, this.vMagLine.mat );
        this.vMagLine.m.position.setY(2);
        this.mesh.add( this.vMagLine.m );
    }
    updatePosition(){
        //super.updatePosition()
        this.mesh.position.copy(this.body.position);
        this.model.quaternion.copy(this.body.quaternion);
    }
    update(){
        this.currSpeed = this.speed - Math.pow(0.001, this.creation.tickDelta);//this.speed*this.creation.tickDelta
        this.body.applyForce(
            this.controls.getForce().multiplyScalar(this.currSpeed),
            this.body.pointToWorldFrame(new CANNON.Vec3())
        );

        this.vMagLine.geom.verticesNeedUpdate = true;

        this.updatePosition();
    }
}

class MenuManager {

}

class EpisodeManager{
    constructor(creation, settings = {}){
        //---------------------------------------------------------
        // Members
        this.creation = creation; // dependancy injection
        this.episodeList = settings.episodeList ? settings.episodeList : []; // a list of episodes to iterate through
        this.index =  0; // should be in save data that should be passed to the game or picked through the menu
        this.activeEpisode = null; // The current episode class being played
        this.nextEpisode = null; // should be bast on activeEpisode
        this.lastEpisode = null; // just for cleanup
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Getters

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Setters


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    start(){
        this.activeEpisode = new this.episodeList[this.index](this.creation);
        this.startActiveEpisode();
    }
    pause(){

    }
    stop(){

    }
    iterateIndex(){
        this.index += 1;
        return this.index
    }

    setActiveEpisode(){
        this.lastEpisode = this.activeEpisode;
        this.activeEpisode = this.nextEpisode;
        this.nextEpisode = this.episodeList[this.iterateIndex()];

        this.creation.renderer.add;

        this.unloadLastEpisode();
    }
    loadNextEpisode(){
        this.nextEpisode = new this.nextEpisode(this.creation);
    }
    unloadLastEpisode(){
        // call Destruct on Episode
        this.lastEpisode.dispose();
        this.lastEpisode = null;
    }

    startActiveEpisode(){
        this.activeEpisode.start();
    }
    endActiveEpisode(){
        this.activeEpisode.stop();
    }
    render(){
        this.activeEpisode.render();
    }
}

//import * as Stats from './../../node_modules/stats-js/build/stats.js'
/* Creation Class 
    Desc: This class is a base class to setup and act as a dependancy hub for canvas, renderer, tickDelta, etc

*/
class Creation {
    constructor(settings = {}){
        //---------------------------------------------------
        // Members
        this.canvas = settings.canvasId ? document.querySelector("#" + settings.canvasId) : document.body;
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.shadowMap.enabled = settings.shadowMapEnabled ? settings.shadowMapEnabled : true;
        if(this.renderer.shadowMap.enabled) this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;


        this.mtlLoader = new THREE.MTLLoader(); // Material Loader
        this.objLoader = new THREE.OBJLoader(); // Object Loader
        this.texLoader = new THREE.TextureLoader; // Texture Loader
        this.collmeshlist = []; // Collidable Mesh List for Collision Detection // Should be in a manager

        // Clock and Tick setup
        this.clock = new THREE.Clock();
        this.tick = this.clock.getElapsedTime();
        this.lastTick = this.tick;
        this.tickDelta = null;

        //---------------------------------------------------
        // Managers

        // Set or Instantiate a MenuManager
        this.menuManager = settings.menuManager ? settings.menuManager : new MenuManager(this);

        // Set or Instantiate EpisodeManager
        this.episodeManager = settings.episodeManager ? settings.episodeManager : new EpisodeManager(this);

        // This is for frame rate stats
        // Commenting for now
        // if(settings.stats){
        //     // Add Stats
        //     this.stats = new Stats()
        //     this.stats.showPanel(0)
        //     document.body.appendChild( this.stats.dom )
        // }

    }

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Getters

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Setters
    setMenuManager(menuManager){
        this.menuManager = menuManager;
    }
    setEpisodeManager(episodeManger){
        this.episodeManager = episodeManger;
    }


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    tickUpdate(){
        this.tick=this.clock.getElapsedTime();
        this.tickDelta = (this.tick - this.lastTick);
        this.lastTick = this.tick;
    }

    start(){
        this.episodeManager.start();
        requestAnimationFrame(()=>this.render());
    }
        ////////////////////////////            \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //\\\\\\\\\\\\\----------------  = RENDER =  ----------------///////////////
        //\\\\\\\\\\\\\\\\\\\\\\\\\\            ////////////////////////////
    render(){
        

        // Update Tick
        this.tickUpdate();

        //mg.stats.begin()
        this.episodeManager.render();
        //mg.stats.end()

        window.requestAnimationFrame(()=>this.render());
    }
}

class Collectible extends YUKA.GameEntity {

	spawn() {

		this.position.x = Math.random() * 15 - 7.5;
		this.position.z = Math.random() * 15 - 7.5;

		if ( this.position.x < 1 && this.position.x > - 1 ) this.position.x += 1;
		if ( this.position.z < 1 && this.position.y > - 1 ) this.position.z += 1;

		//this.Collectible = new Vehicle()




	}

	handleMessage( telegram ) {

		const message = telegram.message;

		switch ( message ) {

			case 'PickedUp':

				this.spawn();
				return true;

			default:

				console.warn( 'Collectible: Unknown message.' );

		}

		return false;

	}

}

class CoreSphere extends ObjectBase{
    constructor(creation, settings){
        settings.texture = creation.texLoader.load(settings.texture ? settings.texture : "./../assets/textures/explosion.png");
        settings.complexity = settings.detail ?? 4;
        settings.timeScale = settings.timeScale ?? 0.025;
        settings.turbScale = 19.0;
        settings.coreMat = new THREE.ShaderMaterial({
            uniforms: {
                tExplosion: { type: "t", value: settings.texture },
                time: {  type: "f",  value: 0.0 },
                turbScale: {type: "f", value: settings.turbScale}
            },
            vertexShader: coreVShader(),
            fragmentShader: coreFShader()
        });
        settings.body = new CANNON.Body({shape: new CANNON.Sphere(1), mass: 4});
        settings.model = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( .9, settings.complexity ), settings.coreMat );
        settings.mesh = new THREE.Object3D();
        super(creation, settings);

        this.model = settings.model;
        this.mesh.add(this.model);
        this.model.position.x = .35; // offset x axis to match this.body position 
        this.texture = settings.texture.dispose();
        this.complexity = settings.complexity;
        this.timeScale = settings.timeScale;
        this.turbScale = settings.turbScale;
        this.coreMat = settings.coreMat;
    }
    updateTime(val){
        this.coreMat.uniforms[ 'time' ].value = val;
    }
    updateTimeScale(val){
        this.timeScale = val;
    }
    updateTexture(t){
        this.coreMat.uniforms['tExplosion'].value = this.texture = mg.tex.load(t);
    }
    updateTurbScale(val){
        this.coreMat.uniforms['turbScale'].value = this.turbScale = val;
    }
    update(){
        this.updateTime(this.creation.tick * this.timeScale);
    }
}

class Enemy extends ObjectBase{
    constructor(creation, camera, settings = {
        // body: new CANNON.Body({shape: new CANNON.Sphere(1), mass:5}),
        mesh: new THREE.Object3D()
    }){
        settings.model = new CoreSphere(creation, {texture: './node_modules/ouro-engine/src/assets/textures/explosion.png', detail: 16});
        settings.body = settings.model.body;
        super(creation, settings);

        this.model = settings.model;
        this.mesh.add(this.model.mesh);

        this.speed = 30;
        this.controls = new Controls(creation, camera, this.model.mesh);

        // Add a line mesh to visulaize the velocity vectors length/direction
        // for testing
        this.vMagLine = {geom: new THREE.Geometry(),mat: new THREE.LineBasicMaterial({color: 0xff0000 }),m:null};
        this.vMagLine.geom.vertices.push( new THREE.Vector3(), this.body.velocity);
        this.vMagLine.geom.verticesNeedUpdate = true;
        this.vMagLine.m = new THREE.Line( this.vMagLine.geom, this.vMagLine.mat );
        this.vMagLine.m.position.setY(2);
        this.mesh.add( this.vMagLine.m );
    }
    applyForce(force){
        this.a.add(force.divideScalar(this.body.mass));
    }
    updatePosition(){
        //super.updatePosition()
        this.mesh.position.copy(this.body.position);
        this.model.mesh.quaternion.copy(this.body.quaternion);
    }
    update(){
        this.currSpeed = this.speed - Math.pow(0.001, this.creation.tickDelta);
        this.controls.update();
        this.body.applyForce(
            this.controls.getForce().multiplyScalar(this.currSpeed),
            this.body.pointToWorldFrame(new CANNON.Vec3())
        );

        this.model.update();

        this.vMagLine.geom.verticesNeedUpdate = true;

        this.updatePosition();
    }
}

class SceneManager {
    constructor(creation, settings = {}){
        this.creation = creation;
        this.sceneList = settings.sceneList ? settings.sceneList : [];
        this.index = settings.index ? settings.index : 0;
        this.activeScene = null;
        this.lastScene = null;
        this.nextScene = null;

        
    }
    iterateIndex(){
        this.index += 1;
        return this.index
    }

    iterateScene(){
        this.lastScene = this.activeScene;
        this.activeScene = this.nextScene;
        this.setNextScene();
        this.iterateIndex();
        this.unloadLastScene();
    }
    setNextScene(index = this.index + 1){
        this.nextScene = this.sceneList[index];
    }
    loadNextScene(){
        if(this.nextScene) this.nextScene = new this.nextScene(this.creation);
    }
    unloadLastScene(){
        // call Destruct on Episode
        this.lastScene.dispose();
        this.lastScene = null;
    }

    startActiveScene(){
        this.activeScene.start();
    }
    endActiveScene(){
        this.activeScene.stop();
        this.loadNextScene();
        this.iterateScene();
    }
    start(){
        this.activeScene = new this.sceneList[this.index](this.creation);
        this.setNextScene();
    }
    render(){
        // call render method of active scene(s)
        if(this.activeScene.render)this.activeScene.render();
        //this.creation.renderer.render(this.activeScene.scene, this.activeScene.camera)
    }

}

class EpisodeSkeleton{
    constructor(creation, settings = {}){
        //---------------------------------------------------------
        // Members
        this.creation = creation;
        this.name = settings.name ? settings.name : 'Episode';


        //---------------------------------------------------------
        // Managers
        this.sceneManager = settings.sceneManager ? settings.sceneManager : new SceneManager(this.creation); // Instantiate SceneManager
    }
    nextScene(){
        this.sceneManager.loadNextScene();
        this.sceneManager.iterateScene();
    }
    goToScene(sceneIndex){
        this.sceneManager.index = sceneIndex;
        this.sceneManager.setNextScene(sceneIndex);
        this.nextScene();
    }
    start(){
        this.sceneManager.start();
    }
    stop(){
        this.sceneManager.stop();
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    render(){
        this.sceneManager.render();
    }
}

/*
    SceneSkeleton Class
    Desc: Extendable class which creates a Context with access to a THREE.js Scene object and Camera object.
        Dirivitive classes can call super in the constructor class before adding things to the scene, and 
        then call the super.render() function in render after updating any movement or physics.
*/
class SceneSkeleton {
    constructor(creation, settings = {}){
        this.creation = creation;

        // THREE
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x202020, 0.025 );
        this.camera = new THREE.PerspectiveCamera(55, this.creation.canvas.clientWidth/this.creation.canvas.clientHeight, 0.1, 1000);
        
        this.setAspect();
        window.addEventListener( 'resize', ()=>{
            this.setAspect();
        }, false );

        this.map = new THREE.Object3D();
        this.scene.add(this.map);

        // CANNON
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase;
        this.debugrenderer = new THREE.CannonDebugRenderer(this.scene, this.world);
    }

    add(obj){
        this.scene.add(obj.mesh);
        this.world.addBody(obj.body);
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    start(){
        // :/ I don't know what to put here yet
        // What part of the scene would need to be started?
    }
    
    end(){

    }

    update(){

    }

    setAspect(){
        this.camera.aspect = this.creation.canvas.clientWidth/ this.creation.canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        this.creation.renderer.setSize( this.creation.canvas.clientWidth, this.creation.canvas.clientHeight );
    }
    render(){
        this.update();
        this.world.step( 1.0/60.0, this.creation.tickDelta, 3 );
        this.creation.renderer.render( this.scene, this.camera );
    }

    // Dispose
    dispose(){
        // dereference everything
        this.scene = null;
        this.camera = null;
        this.render = null;
        
    }
}

class PlayableScene extends SceneSkeleton{
    constructor(creation, settings){
        super(creation, settings);
        this.player = null;
    }
    update(){
        let t = 1.0 - Math.pow(0.001, this.creation.tickDelta);
        let inversePos = this.player.body.position.clone();
        inversePos = inversePos.scale(-1);
        this.scene.position.lerp(new THREE.Vector3(inversePos.x, inversePos.y, inversePos.z), t);
    }
}

class Utils{
    static getCenterPoint(mesh) {
        let geometry = mesh.geometry;
        geometry.computeBoundingBox();   
        console.log(geometry);
        let center = geometry.boundingBox.getCenter(new THREE.Vector3());
        console.log(center);
        mesh.localToWorld( center );
        console.log(center);
        return center;
    }
}

export { BasicCube, BasicSphere, BasicTorus, Bee, Character, Collectible, Controls, CoreSphere, Creation, Enemy, EpisodeManager, EpisodeSkeleton, FindNextCollectibleGoal, GatherEvaluator, GatherGoal, MenuManager, ObjectBase, PickUpCollectibleGoal, PlayableScene, RestEvaluator, RestGoal, SceneManager, SceneSkeleton, SeekToCollectibleGoal, Utils };
