import {GoalEvaluator} from './../../node_modules/yuka/build/yuka.module.js'
import {GatherGoal} from './gatherGoal.js'

export class GatherEvaluator extends GoalEvaluator {

	calculateDesirability() {

		return 0.5;

	}

	setGoal( bee ) {

		const currentSubgoal = bee.brain.currentSubgoal();

		if ( ( currentSubgoal instanceof GatherGoal ) === false ) {

			bee.brain.clearSubgoals();
			

			bee.brain.addSubgoal( new GatherGoal( bee ) );

		}

	}

}