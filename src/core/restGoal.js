import {Goal} from './../../node_modules/yuka/build/yuka.module.js'

export class RestGoal extends Goal{
    
    constructor(owner){
        super(owner)
        
        this.REST = 'REST';
        
        this.PLACEHOLDER = '-';
    }
    //need three things, Activate, Execute, and Terminate

    //Activate
    activate() {
        // this.owner.ui.currentGoal.textContent = this.REST;
        // this.owner.ui.currentSubgoal.textContent = this.PLACEHOLDER;
    }

    //Execute
    execute() {
        this.owner.currentTime += this.owner.tickDelta
        if (this.owner.currentTime >= this.owner.restDuration){
            this.status = Goal.STATUS.COMPLETED;
        }

    }

    //Terminate
    terminate() {
        this.owner.currentTime = 0;
        this.fatigueLevel = 0;
    }
}
