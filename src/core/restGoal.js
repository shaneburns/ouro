import {Goal} from './../../node_modules/yuka/build/yuka.module.js'

export class RestGoal extends Goal{
    
    constructor(creation){
        super()
        this.creation = creation;
        this.REST = 'REST';
        
        this.PLACEHOLDER = '-';
    }
    //need three things, Activate, Execute, and Terminate

    //Activate
    activate() {
        this.creation.ui.currentGoal.textContent = this.REST;
        this.creation.ui.currentSubgoal.textContent = this.PLACEHOLDER;
    }

    //Execute
    execute() {
        this.creation.currentTime += this.creation.tickDelta
        if (this.creation.currentTime >= this.creation.restDuration){
            this.status = Goal.STATUS.COMPLETED;
        }

    }

    //Terminate
    terminate() {
        this.creation.currentTime = 0;
        this.fatigueLevel = 0;
    }
}
