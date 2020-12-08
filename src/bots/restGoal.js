export class RestGoal extends YUKA.Goal{
    
    constructor(owner){
        super(owner)
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
        const owner = this.owner
        
        console.log("RestGoal executing");
        owner.currentTime += owner.deltaTime
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
        const owner = this.owner
        owner.currentTime = 0;
        owner.fatigueLevel = 0;
    }
}
