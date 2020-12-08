import { RestGoal } from './restGoal.js';

export class RestEvaluator extends YUKA.GoalEvaluator{

    calculateDesirability( bee ) {
        console.log("calculating Rest desirability ");
        
        console.log("rest desireability = bee.tired = " + bee.tired());
        return(bee.tired() === true ) ? 1 : 0;
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