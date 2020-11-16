class EpisodeManager{
    constructor(creation, settings = {}){
        //---------------------------------------------------------
        // Members
        this.creation = creation // dependancy injection
        this.episodeList = settings.episodeList ? settings.episodeList : [] // a list of episodes to iterate through
        this.index =  0 // should be in save data that should be passed to the game or picked through the menu
        this.activeEpisode = null; // The current episode class being played
        this.nextEpisode = null; // should be bast on activeEpisode
        this.lastEpisode = null; // just for cleanup
    }
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Getters

    
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Setters


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Methods
    start(){
        this.activeEpisode = new this.episodeList[this.index](this.creation)
        this.startActiveEpisode()
    }
    pause(){

    }
    stop(){

    }
    iterateIndex(){
        this.index += 1
        return this.index
    }

    setActiveEpisode(){
        this.lastEpisode = this.activeEpisode
        this.activeEpisode = this.nextEpisode
        this.nextEpisode = this.episodeList[this.iterateIndex()]

        this.creation.renderer.add

        this.unloadLastEpisode()
    }
    loadNextEpisode(){
        this.nextEpisode = new this.nextEpisode(this.creation);
    }
    unloadLastEpisode(){
        // call Destruct on Episode
        this.lastEpisode.dispose()
        this.lastEpisode = null
    }

    startActiveEpisode(){
        this.activeEpisode.start()
    }
    endActiveEpisode(){
        this.activeEpisode.stop()
    }
    render(){
        this.activeEpisode.render();
    }
}
export {EpisodeManager}