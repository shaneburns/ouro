// Revamped Replacement for Operator.IO
// - AJAX
// - Loading Flag
// - Structure URL/El Packs
// - $.extend stdPack Structure
// - Copy Operator.IO
// - Implement Queuing timers and actions

//      Patcher.js -Va.2.c
//      ------------------
//      Desc./Mission:
//          Extend $.ajax functionality to act as the include() function in PHP.
//          Insert a piece of content into a page *extacly where you want it* in one line of code.(sometimes a long one ;P)
//      ------------------
//      When fully implemented this class can call entire pages of content and handle the displaying
//      of those pages/elements based off your(the developer's) css, somewhat automagically.  This,
//      unfortunately, can be thought of as a CMS, since it is technically managing content. Let me
//      assure you, where a CMS like WordPress can be a big layer piled in between you and your code/content,
//      Patcher is crumbs and crump(et)s!  And it is oh so good...
//      ------------------
//      Patcher is based off of and utilizes:
//          ** jQuery's AJAX plugin
//          ** HTML5's History API
//          ** The beauty of CSS3's abilities
//          ** PHP's security and awesomness
//
//      Change Log ||
//          ** 08/20/2017   - Refactored the smblr() function in cacheingLogic.php to allow for infinite scalability
//          ** 08/19/2017   - Incorporation of a loader element has be made
/*
\\\\\\\\\\\\\\\\\\\\\\\\\\
    Add an ultimate image preloader system built into Patcher(images will not slow down Patcher!)
//////////////////////////
*/

const Patcher = Class.extend({
    //Pack Frame Work :: SFW Va.2
    init: function(baseURL){
        this.stdPack = {
            mode: 'track',//* 'page','replaceState','discard' // TODO: further thought on naming and implementation
            domain: baseURL,
            url: '',//*
            method: 'POST',
            data: {contentOnly: true},
            title: '',//*
            meta: '',//*
            parent: '',//*
            selector: '',//*
            name: '',//*
            result: '',
            attachBy: 'append',// 'prepend','before','after'
            remove: null,
            anim: { on: false, propName: '', class: 'hidden'}//*
        }
        this.busy = false// AJAX FLAG
        this.pbusy = false// Pack FLAG
        this.loader = null// Loader Element
        this.cache = {}// Cache of all pages/shells requested in tracking mode
        this.currPack = null
        this.nextPack = null
        this.tEndStr = 'transitionend webkitTransitionEnd oTransitionEnd'// : Transition End String
        this.togglePack = function(pack,isCurr=false,set=false){
            if(isCurr){if(set){if(this.pbusy === 1){if(pack.anim.on && !$(pack.selector).hasClass('hidden')){$(pack.selector).addClass(pack.anim.class);} setTimeout(()=>{this.togglePack(pack,true,true);},2);return true;}if(!$.isEmptyObject(pack)){this.currPack = $.extend({},{},this.nextPack);this.nextPack = null;}else{return true;} }else{ if(pack && !$.isEmptyObject(pack)){this.pbusy = 1;if(this.loader.hasClass('hidden')){this.loader.removeClass('hidden');}}else{this.pbusy = 2;return true;}}}
            if(pack.anim.on){
                $(pack.selector).on(this.tEndStr, (e)=>{
                    if(e.originalEvent.propertyName === pack.anim.propName){ $(pack.selector).off(this.tEndStr);if(set){ this.cache.openPacks[pack.selector] = true;if(isCurr){this.pbusy = false;this.loader.addClass('hidden');} }else{ delete this.cache.openPacks[pack.selector];this.out(pack.selector);if(isCurr){this.pbusy = 2;} }}
                }); $(pack.selector).addClass(pack.anim.class);if(set){setTimeout(()=>{$(pack.selector).removeClass(pack.anim.class);},20);}
            }else{ if(set){console.log(pack.selector);this.cache.openPacks[pack.selector] = true;}else{delete this.cache.openPacks[this.currPack.selector];this.out(pack.selector);if(isCurr){this.pbusy = 2;}}}
        }
        this.save = function(pack){ //Save pock for later use
            if(this.cache[pack.name] === undefined){this.cache[pack.name] = pack;}
            else if(this.cache[pack.name]){
                if(this.nextPack&&this.nextPack.name === pack.name){this.nextPack = $.extend({},{},pack);this.togglePack(this.nextPack,true,true);}
                if(pack.result === ''&&this.cache[pack.name].result !== ''){pack.result = this.cache[pack.name].result;}
                this.cache[pack.name] = $.extend({},this.cache[pack.name],pack);
                if(pack.mode === 'page-wo'){this.togglePack(this.cache[pack.name],false,true);}
            }
        }
        // Pack Queueing System
        this.list = [],
        this.queueIn = function(name){
            if(!this.cache.openPacks){this.cache.openPacks = {};} if(this.cache[name].mode === 'track-wo' || this.cache[name].mode === 'cache-wo'){ this.updatePack($.extend({},{},this.cache[name]));return true; }
            if(this.currPack && this.currPack.name === name){return true;} if(this.list.length >= 1){ for(let i = this.list.length;i--;){ if(this.list[i] === name){return true;} } } this.list.push(name);if (this.timer === undefined){ this.timer = setInterval(this.loop,2); }
        },
        this.step = function(){ this.pbusy = true; this.nextPack = $.extend({},{},this.cache[this.list.splice(0,1)[0]]);this.togglePack(this.currPack,true);this.updatePack($.extend({},{},this.nextPack));},
        this.loop = function(){ if(mg.patch.list.length >= 1){ if(!mg.patch.pbusy){ mg.patch.step(); }else if(mg.patch.list.length >= 3){mg.patch.list = [mg.patch.list[mg.patch.list.length - 1]]; } }else{ clearInterval(mg.patch.timer);mg.patch.timer = undefined; } },
        this.timer = undefined
    },//END INIT
    updatePack: function(pack = {}){
        if (pack.mode === 'page' && pack.result !== ''){this.finalize(pack);return true;}
        if(pack.data){pack.data = $.extend({},this.stdPack.data, pack.data);}if(pack.anim){pack.anim = $.extend({},this.stdPack.anim, pack.anim);}
        pack = $.extend({}, this.stdPack, pack)// Extend pack into the stdPack
        if (pack.remove !== null && pack.remove !== ''){ this.out(pack.remove);}
        if (pack.parent === '' || pack.parent === null){ return true, 'The parent element must be specified to insert the requested content into using the "parent" property.'; }
        if (pack.result !== ''){mg.patch.finalize(pack);return true;}
        if (pack.url !== ''&& typeof pack.url === 'string'){ this.request(pack);}// should add regex??
    },
    request: function(pack){ // TODO: Add Error Handling :TODO
        mg.patch.busy = true;pack.result = '';$.ajax({ method: pack.method, url: pack.url, data: (pack.mode==='cache'||pack.mode==='cache-wo') ? {pack: $.extend({},{},pack)} : pack.data }).done(function(result){mg.patch.busy = false;pack.result = result;mg.patch.finalize(pack); })
    },
    finalize: function(pack){ if(pack.result !== ''){if($(pack.selector).length < 1){this.insert(pack);}} if(pack.mode !== 'discard'){ if (pack.title && pack.title !== $('title').text()){ $('title').text(pack.title);}this.hapi(pack);if(pack.mode == 'track-wo' || pack.mode == 'page-wo' || pack.mode == 'cache-wo'){pack.mode = 'page-wo';}else{pack.mode = 'page';}this.save(pack); }
    },
    insert: function(pack){
        const content = $(pack.result)
        const errorMsg = "Sorry, that's not implemented quite yet. Send me a message to see about adding it."
        switch(pack.attachBy){
            case Array.isArray(pack.attachBy):
                switch (pack.attachBy[0]){
                    case 'before': content.insertBefore(pack.attachBy[1]);break
                    case 'after': content.insertAfter(pack.attachBy[1]);break
                    default: console.log(errorMsg);break; } break
            case 'prepend': $(pack.parent).prepend(content);break
            case 'append': $(pack.parent).append(content);break
            default: console.log(errorMsg);break; }
    },
    in: function(pack = {}){
        if(!$.isEmptyObject(pack)){
            if (pack.name){ for(let key in this.cache){ if (pack.name === key){ if(pack.mode && pack.mode === 'replaceState'){if(!pack.result && this.cache[pack.name].result !== ''){pack.result = this.cache[pack.name].result;pack = $.extend({},this.cache[pack.name],pack);}else if(pack.result && pack.result !== 'new'){console.log('read the manual');}}this.save(pack);this.queueIn(pack.name);return true; }} }
            this.updatePack(pack)
        }
    },
    out: function(slctr){
        if(!this.cache.openPacks[slctr] && this.currPack && slctr === this.currPack.selector){this.currPack = null;}else if(this.cache.openPacks[slctr] && this.currPack && slctr === this.currPack.selector){this.togglePack(this.currPack,true);return true;} else if(this.cache.openPacks[slctr]){for(let key in this.cache){ if(this.cache[key].selector === slctr){this.togglePack(this.cache[key]);return true;}}} $(slctr).remove(); },
    // HISTORY API -------------// :HAPI:
    hapi: function(pack){if(pack.mode === 'track' || pack.mode === 'cache' || pack.mode === 'page'){history.pushState({name: pack.name, url: pack.url}, null, pack.url);}else if(pack.mode === 'replaceState'){history.replaceState({name: pack.name, url: pack.url}, null, pack.url);}}
})

window.addEventListener('popstate', function(e) {
    // e.state is equal to the data-attribute
    const character = e.state;

    if(!character){
        mg.patch.in({name: character.name,mode:'popState'})
    }else{
        mg.patch.in({name: character.name,mode:'popState'})
    }

})
