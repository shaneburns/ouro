class SceneManager {
    constructor(options){
        this.list = options.list ? options.list : []
        this.activeScene = null;
    }

    render(){
        // call render method of active scene(s)
    }

}

export {SceneManager};