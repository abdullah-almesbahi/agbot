(function(){
  var Step = function(config, steps){
    //this.title = config.title;
    //this.config = config;
    this.steps = steps;
    if(config.template)
      this.copy(config.template);

    this.init(config);

    this.generateHandle();
  };

  Step.prototype.copy = function(template){
      var s = this.steps.get(template);
      if(!s)
        gn.tools.log("WARNING: Step template " + template + " is undefined", 0);
      this.init(s);
  }

  Step.prototype.init = function(config){
    for (var key in config) {
        if (config.hasOwnProperty(key)) this[key] = config[key];
    }
  }

  Step.prototype.generateHandle = function(){
    if(this.type === 'custom')
      this.handle = this.handle;
    else
      this.handle = this.types[this.type];
  };

  Step.prototype.types = function(){
  };

  /*
  {
    key:4
  }
  */
  Step.prototype.types.keyEvent = function(){
    gn.player.input.keyEvent(this.key);
    return true;
  }

  /*
  {
    images:[new Image()],
    tries:2,
    confirms:3,
    continue:false //stop after first image detection

  }
  */
  Step.prototype.types.find = function(){
    var me = this;
    var result = false;
    if(this.images){
      if(this.continue){
        this.images.every(function(img){
         return result = img.find({
           tries:me.tries,
           confirms:me.confirms
         });
       });
     }else {
       this.images.some(function(img){
         return result = img.find({
          tries:me.tries,
          confirms:me.confirms
        });
      });
     }
    }

    return result;
  }
  /*
  {
    images:[new Image()],
    position:{x: 10, y:10} // tap a position directly instead of an image
    tries:2,
    confirms:3,
    continue:false, //stop after first image detection
    offset:{x:10, y: 10},
    center:true //tap center of the screen
  }
  */
  Step.prototype.types.center = function(){
    var me = this;
    var result = false;
    if(this.images){

       this.images.some(function(img){
        result = img.find({
          tries:me.tries,
          confirms:me.confirms,
        });
        if(result){
          var x = result[0].x, y = result[0].y
          if(this.tap){
            for (var i = 0; i < this.tap.times ? this.tap.times : 1; i++) {
              if(this.tap.delay && this.tap.delay.before)
                gn.tools.wait(this.tap.delay.before);

              gn.player.input.tap(x, y);

              if(this.tap.delay && this.tap.delay.after)
                gn.tools.wait(this.tap.delay.after);

            }
          }
          gn.player.input.center(x, y, this.speed);
        }
        return result;
      });
    }else if(this.position){
        gn.player.input.center(this.position.x, this.position.y, this.speed);
        return this.position;
    }
    return result;
  }

  /*
  {
    images:[new Image()],
    position:{x: 10, y:10} // tap a position directly instead of an image
    tries:2,
    confirms:3,
    continue:false, //stop after first image detection
    offset:{x:10, y: 10},
    center:true //tap center of the screen
  }
  */
  Step.prototype.types.swipe = function(){
    var me = this;
    if(this.position){
        gn.player.input.customSwipe(this.position.x1, this.position.y1, this.position.x2, this.position.y2, this.speed ? this.speed : 1000);
        return this.position;
    }
    return true;
  }

  /*
  {
    images:[new Image()],
    position:{x: 10, y:10} // tap a position directly instead of an image
    tries:2,
    confirms:3,
    continue:false, //stop after first image detection
    offset:{x:10, y: 10},
    center:true //tap center of the screen
  }
  */
  Step.prototype.types.tap = function(){
    var me = this;
    var result = false;
    if(this.images){
      if(this.continue){
        this.images.every(function(img){
         return result = img.tap({
           tries:me.tries,
           confirms:me.confirms,
           offset:me.offset
         });
       });
     }else {
       this.images.some(function(img){
        return result = img.tap({
          tries:me.tries,
          confirms:me.confirms,
          offset:me.offset
        });
      });
     }
    }else if(this.position){
        gn.player.input.tap(this.position.x, this.position.y);
        result = true;
    }else if(this.center){
        gn.player.input.tap(0);
        result = true;
    }

    return result;
  }

  Step.prototype.run = function(previous){
    var executions = 1;
    var result;

    this.onBefore();
    this.onLog();

    this.steps.current = undefined;

    if(this.repeat && this.repeat > 0)
      executions += this.repeat;

    if(this.attempts && this.attempts > 0)
      executions += this.attempts;

    for (var i = 0; i < executions; i++) {
      result = this.handle(previous);
      if(result && this.attempts)
        break;
    }
    this.onAfter();

    if(result)
      this.onSuccess(result);
    else
      this.onFail(result);

    return result;
  }

  Step.prototype.onBefore = function(){
    if(this.before){
      this.before();
    }
    if(this.delay && this.delay.before){
      gn.tools.wait(this.delay.before);
    }
  }


  Step.prototype.onAfter = function(){
    if(this.after){
      this.after();
    }
    if(this.delay && this.delay.after){
      gn.tools.wait(this.delay.after);
    }
  }

  Step.prototype.onSuccess = function(result){
    if(this.log && this.log.success){
      gn.tools.log(this.log.success, 0);
    }
    if(this.success){
      if(isFunction(this.success)){
        this.success(this, result);
      }else{
        //this.steps.play(this.success, result);
        this.steps.next(this.success, result);
      }
    }
  }

  Step.prototype.onFail = function(result){
    if(this.log && this.log.fail){
      gn.tools.log(this.log.fail, 0);
    }
    if(this.fail){
      if(isFunction(this.fail)){
        this.fail(this, result);
      }else{
        //this.steps.play(this.fail, result);
        this.steps.next(this.fail, result);
      }
    }
  }

  Step.prototype.onLog = function(){
    if(this.log){
      if(this.log && this.log.run){
        gn.tools.log(this.log.run, 0);
      }else if(typeof this.log === 'string')
        gn.tools.log(this.log, 0);
    }
  }

  function isFunction(functionToCheck) {
   return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }


  return {
    Step: Step,
  }
})();
