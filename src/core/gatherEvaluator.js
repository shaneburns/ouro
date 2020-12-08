import {GoalEvaluator} from './../../node_modules/yuka/build/yuka.module.js'
import {GatherGoal} from './gatherGoal.js'

export class GatherEvaluator extends GoalEvaluator {

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