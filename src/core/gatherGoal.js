import { CompositeGoal, Goal }from './../../node_modules/yuka/build/yuka.module.js'

export class GatherGoal extends CompositeGoal{
    constructor(creation){
        super()
        this.creation = creation;
        this.GATHER = 'GATHER';
    }

    activate(){
        this.ui.currentGoal.textContent = this.GATHER;
        this.addSubgoal( new FindNextCollectibleGoal( this.creation ) );
        this.addSubgoal( new SeekToCollectibleGoal( this.creation ) );
		this.addSubgoal( new PickUpCollectibleGoal( this.creation ) );
	}

	execute() {

		this.status = this.executeSubgoals();

		this.replanIfFailed();

	}

}

//Find next collectible Goal
class FindNextCollectibleGoal extends Goal {

	constructor( creation ) {

        super();
        this.creation = creation;
        this.FIND_NEXT = 'FIND NEXT';

        this.inverseMatrix = new Matrix4();
        this.localPosition = new Vector3();
		this.animationId = null;

	}

	activate() {

		const creation = this.creation;

		// update UI

		creation.ui.currentSubgoal.textContent = this.FIND_NEXT;

		// select closest collectible

		const entities = creation.manager.entities;
		let minDistance = Infinity;

		for ( let i = 0, l = entities.length; i < l; i ++ ) {

			const entity = entities[ i ];

			if ( entity !== creation ) {

				const squaredDistance = creation.position.squaredDistanceTo( entity.position );

				if ( squaredDistance < minDistance ) {

					minDistance = squaredDistance;
					creation.currentTarget = entity;

				}

			}

		}

		// determine if the bee should perform a left or right turn in order to face
		// the collectible

		creation.updateWorldMatrix();
		creation.worldMatrix.getInverse( inverseMatrix );
		localPosition.copy( creation.currentTarget.position ).applyMatrix4( inverseMatrix );
		turn.reset().fadeIn( creation.crossFadeDuration );

	}

	execute() {

		const creation = this.creation;

		if ( creation.currentTarget !== null ) {

			if ( creation.rotateTo( creation.currentTarget.position, creation.deltaTime ) === true ) {

				this.status = Goal.STATUS.COMPLETED;

			}

		} else {

			this.status = Goal.STATUS.FAILED;

		}

	}

	terminate() {
		const creation = this.creation;

    		

	}

}

//
//Seek the goal
class SeekToCollectibleGoal extends Goal {

	constructor( creation ) {

        super();
        this.creation = creation
        
        this.SEEK = 'SEEK';
        this.PICK_UP = 'PICK UP';
        this.PLACEHOLDER = '-';

        this.WALK = 'WALK';
        this.RIGHT_TURN = 'RIGHT_TURN';
        this.LEFT_TURN = 'LEFT_TURN';
        this.IDLE = 'IDLE';

        this.inverseMatrix = new Matrix4();
        this.localPosition = new Vector3();
		

    }
    activate() {

		const creation = this.creation;

		// update UI

		creation.ui.currentSubgoal.textContent = this.SEEK;

		//

		if ( creation.currentTarget !== null ) {

			const arriveBehavior = creation.steering.behaviors[ 0 ];
			arriveBehavior.target = creation.currentTarget.position;
			arriveBehavior.active = true;

		} else {

			this.status = Goal.STATUS.FAILED;

		}

		//


	}
	execute() {

		if ( this.active() ) {

			const creation = this.creation;

			const squaredDistance = creation.position.squaredDistanceTo( creation.currentTarget.position );

			if ( squaredDistance < 0.25 ) {

				this.status = Goal.STATUS.COMPLETED;

			}

			// adjust animation speed based on the actual velocity of the bee

		}

	}

	terminate() {

		const arriveBehavior = this.creation.steering.behaviors[ 0 ];
		arriveBehavior.active = false;
		this.creation.velocity.set( 0, 0, 0 );

		//

		const creation = this.creation;

		//stop bee flying

	}

}
//now for the final, collect pollen
class PickUpCollectibleGoal extends Goal {

	constructor( creation ) {

        super();
        this.creation = creation;
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

        this.inverseMatrix = new Matrix4();
        this.localPosition = new Vector3();creation

		this.collectibleRemoveTimeout = 3; // the time in seconds after a collectible is removed

    }

	activate() {

		const creation = this.creation;

		creation.ui.currentSubgoal.textContent = this.PICK_UP;

		const gather = creation.animations.get( this.GATHER );
		gather.reset().fadeIn( creation.crossFadeDuration );

	}

	execute() {

		const creation = this.creation;
		creation.currentTime += creation.tickDelta;

		if ( creation.currentTime >= creation.pickUpDuration ) {

            this.status = Goal.STATUS.COMPLETED;
            
		} else if ( creation.currentTime >= this.collectibleRemoveTimeout ) {

			if ( creation.currentTarget !== null ) {

				creation.sendMessage( creation.currentTarget, 'PickedUp' );
				creation.currentTarget = null;

			}
		}

	}

	terminate() {

		const creation = this.creation;

		creation.currentTime = 0;
		creation.fatigueLevel ++;

		

	}

}