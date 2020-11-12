//  mg - (MasterGlobal Toolkit)
/*      # JDQE - jQuery Done Quick'n Easy
            #
            #
            #
            #
            #
*/
(function(window){
    function MG(selector){
        const self = {}
        self.selector = selector
        if(typeof(self.selector) === 'object'){
            self.el = self.selector
        }
        else self.el = (document.querySelectorAll(self.selector).length > 1) ? document.querySelectorAll(self.selector) : document.querySelector(self.selector)

        self.height = ()=>{
            return self.el.offsetHeight;
        }
        self.width = ()=>{
            return self.el.offsetWidth;
        }
        self.on = (type,callback)=>{
            self.el['on'+type] = callback
        }


        // Menu control for Nav
        // This allows you to quickly hide and show a nav and an overly with one function call
        // pass mg the name of your nav and overlay(or any element you want to toggle the class of in the process)
        // e.g. mg('nav, .partition').menu(mg('.partition'))
        self.menu = {
            init: function(ctrls){ //Initialize Navigation controls
                this.nav = self.el
                this.ctrls = ctrls.el
                for(let n = this.ctrls.length;n--;){ this.ctrls[n].onclick = () => this.toggle(); }
            },
            nav: null,
            ctrls: null,
            toggle:/*Hide or Show Menu*/ function(){for(let n = this.nav.length;n--;){ this.nav[n].classList.toggle('hidden');}}
        }

        self.accordian = {
            init: function(tabs){
                this.tabs = self.el
                for(let n=this.tabs.length;n--;){this.tabs[n].onclick = () => this.tabs[n].classList.toggle('active');}
            },
            tabs: null
        }
        return self
    }
    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.mg) === 'undefined'){
        window.mg = MG;
    }

    // Random Number Generators for decimals and integers
    mg.rand = ( max = 1,min = 0 )=>{ return Math.random() * (max - min) + min; }
    mg.randInt = ( max = 1, min = 0 )=>{ return Math.floor(Math.random() * (max - min + 1)) + min; }
    // Absolute Value
    mg.abs = (val)=>{ return (-(val) > 0) ? -(val): (val); }
})(window); // Pass the window variable into MG
