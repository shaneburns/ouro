import { CompositeGoal, Goal }from './../../node_modules/yuka/build/yuka.module.js'
//const inversyMatrix = new YUKA.Matrix4()
export class GatherGoal extends CompositeGoal{
    constructor(owner){
        super(owner)
		
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
class FindNextCollectibleGoal extends Goal {

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
		console.log(this.localPosition)

		owner.updateWorldMatrix();
		console.log(owner.worldMatrix);
		console.log('/////////////')
		owner.worldMatrix.getInverse(this.inverseMatrix );
		console.log(this.inverseMatrix);
		this.localPosition.copy( owner.currentTarget.position ).applyMatrix4( this.inverseMatrix );
		console.log(this.localPosition);
		//this.turn.reset().fadeIn( owner.crossFadeDuration );

	}

	execute() {

		const owner = this.owner;

		if ( owner.currentTarget !== null ) {

			if ( owner.rotateTo( owner.currentTarget.position, owner.deltaTime ) === true ) {

				this.status = Goal.STATUS.COMPLETED;

			}

		} else {

			this.status = Goal.STATUS.FAILED;

		}

	}

	terminate() {
		const owner = this.owner;

    		

	}

}

//
//Seek the goal
class SeekToCollectibleGoal extends Goal {

	constructor( owner ) {

        super(owner);
        
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

		// update UI

		// owner.ui.currentSubgoal.textContent = this.SEEK;

		//

		if ( owner.currentTarget !== null ) {

			const arriveBehavior = owner.steering.behaviors[ 0 ];
			arriveBehavior.target = owner.currentTarget.position;
			arriveBehavior.active = true;

		} else {

			this.status = Goal.STATUS.FAILED;

		}

		//


	}
	execute() {

		if ( this.active() ) {

			const owner = this.owner;

			const squaredDistance = owner.position.squaredDistanceTo( owner.currentTarget.position );

			if ( squaredDistance < 0.25 ) {

				this.status = Goal.STATUS.COMPLETED;

			}

			// adjust animation speed based on the actual velocity of the bee

		}

	}

	terminate() {

		const arriveBehavior = this.owner.steering.behaviors[ 0 ];
		arriveBehavior.active = false;
		this.owner.velocity.set( 0, 0, 0 );

		//

		const owner = this.owner;

		//stop bee flying

	}

}
//now for the final, collect pollen
class PickUpCollectibleGoal extends Goal {

	constructor( owner ) {

        super(owner);
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

		// owner.ui.currentSubgoal.textContent = this.PICK_UP;

		const gather = owner.animations.get( this.GATHER );
		gather.reset().fadeIn( owner.crossFadeDuration );

	}

	execute() {

		const owner = this.owner;
		owner.currentTime += owner.tickDelta;

		if ( owner.currentTime >= owner.pickUpDuration ) {

            this.status = Goal.STATUS.COMPLETED;
            
		} else if ( owner.currentTime >= this.collectibleRemoveTimeout ) {

			if ( owner.currentTarget !== null ) {

				owner.sendMessage( owner.currentTarget, 'PickedUp' );
				owner.currentTarget = null;

			}
		}

	}

	terminate() {

		const owner = this.owner;

		owner.currentTime = 0;
		owner.fatigueLevel ++;

		

	}

}