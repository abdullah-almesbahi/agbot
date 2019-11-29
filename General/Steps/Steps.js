(function(){
  var Steps = function(steps, entryPoint, config){
    this.list = {};
    this.result = undefined;
    this.current = entryPoint;
    this.entryPoint = entryPoint;
    this.config = config;

    if(config && config.debug){
      Print("STEP DEBUGGING ON");
    }

    if(Array.isArray(steps)){
      var me = this;
      steps.every(function(ls){
        return me.init(ls);
      });
    }else{
      this.init(steps);
    }

  }

  Steps.prototype.reset = function(){
    this.current = this.entryPoint;
  }

  Steps.prototype.init = function(steps){
    this.add(steps);
    return true;
  }

  Steps.prototype.solve = function(){
    this.resolved = false;

  }

  Steps.prototype.pulse = function(){
    if(this.current)
      this.result = this.play(this.current, this.args);


    return {
      resolved: this.current ? false : true,
      result:this.result
    }
  }

  Steps.prototype.next = function(title, args){
    this.current = title;
    this.args = args;
  }

  Steps.prototype.play = function(title, args){
    var s = this.get(title);

    if(!s)
      gn.tools.log("WARNING: Step " + title + " is undefined", 0);

    if(this.config && this.config.debug){
      Print("STEP DEBUG: " + title);
    }

    this.result = s.run(args) ;
    /*if(s.run(args))
      this.result = true;
    else {
      this.result = false;
    }
    */
  }

  Steps.prototype.get = function(title){
    return this.list[title];
  }

  Steps.prototype.add = function(config){
    var s;
    if(Array.isArray(config)){
      for (var i = 0; i < config.length; i++) {
        s = new Step(config[i], this);
        this.list[s.title] = s;
        Print(s.title);
      }
    }else{
      s = new Step(config, this);
      this.list[s.title] = s;
    }
  }

  return {
    Steps: Steps
  }
})();
