import {GoalEvaluator}from './../../node_modules/yuka/build/yuka.module.js'
import {RestGoal} from './restGoal.js'

export class RestEvaluator extends GoalEvaluator{

    calculateDesirability( bee ) {
        return(bee.tired() === true ) ? 1 : 0;
    }

    setGoal( bee ){
        const currentSubgoal = bee.brain.currentSubgoal();

		if ( ( currentSubgoal instanceof RestGoal ) === false ) {

			bee.brain.clearSubgoals();

			bee.brain.addSubgoal( new RestGoal( bee ) );

		}

	}

}