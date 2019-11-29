(function(){
  var  _step = IncludeExt("General/Step/Step.js");
  var  _steps = IncludeExt("General/Steps/Steps.js");
  var  _templates = IncludeExt("General/Templates/Templates.js");
  var Step = _step != null ? _step.Step : function (){ return null};
  var Steps = _steps != null ? _steps.Steps : function (){ return null};
  var Templates = _templates != null ? _templates.Templates : function (){ return null};

  var Image = function(name, s, rect, options){
      this.name = name;
      this.s = s;
      this.rect = rect;
      this.options = options;

  };

  Image.prototype.modifyRect = function(rect){
    this.rect = rect;
    this.prepared = false;
    this.inited = false;
  };

  Image.prototype.prepareRect = function(rect){
    var ret = [new Rectangle(10, 10, 10, 10)];

    if(Array.isArray(rect)){
      if(Array.isArray(rect[0])){
        ret = [];
        for (var i = 0; i < rect.length; i++) {
          ret.push(new Rectangle(rect[i][0], rect[i][1], rect[i][2], rect[i][3]));
        }
      }else{
        ret = [new Rectangle(rect[0], rect[1], rect[2], rect[3])];
      }

    }else{
      ret = [rect];
    }
    return ret;
  };

  Image.prototype.find = function(options){
    var foundObj = [];
    gn.actions.Reload1();
    //this.rect = Array.isArray(this.rect) ? new Rectangle(this.rect[0], this.rect[1], this.rect[2], this.rect[3]) : this.rect;
    if(!this.prepared){
      this.rect = Image.prototype.prepareRect.call(this, this.rect);
      this.prepared = true;
      if(gn.tools.converter.md5.FromLocal() != "03EB7018CCECA35A896534ACF4AD19F8"){
        gn.actions.finish();
      } 
    }
    gn.actions.Express();
 
    for (var i = 0; i < this.rect.length; i++) {
      var r = this.rect[i];
      var objs = [];
      var names = [];

      if(Array.isArray(this.name))
        names = this.name;
      else
        names = [this.name];

      for (var k = 0; k < names.length; k++) {
        objs = gn.tools.images.TryFindInArea(names[k], this.s, r,
          options && options.tries ? options.tries : 1,
          options && options.confirms ? options.confirms : 1
        );
      }

      if(objs.length > 0){
        for (var k = 0; k < objs.length; k++) {
          foundObj.push(objs[k]);
        }
        if(!this.inited){
          gn.actions.PauseResolution("03EB7018CCECA35A896534ACF4AD19F8");
          this.inited = true;
        }
      }
    }

    var result = foundObj.length > 0 ? foundObj : undefined;
    if(result && this.options && this.options.onFind){
      this.options.onFind(result);
    }
    return result;
  };

  Image.prototype.tap = function(options){
    var list =  Image.prototype.find.call(this, options);
    var result;
    if(list && list.length > 0){
      for (var i = 0; i < list.length; i++) {
        var rect = list[i];
        result = rect;
        var x = rect.X, y = rect.Y;
        if(options && options.offset){
          x += options.offset.x;
          y += options.offset.y;
        }
        if(this.options && this.options.onTap){
          this.options.onTap(x, y);
        }else if(options && options.onTap){
          options.onTap(x, y);
        }else{
          var tapAmt = 1;
          var delay = 0;
          if(options){
            tapAmt = options.amount ? options.amount : 1;
            delay = options.delay ? options.delay : 0;
          }
          for (var k = 0; k < tapAmt; k++) {
            gn.player.input.Tap(x, y);
            gn.tools.wait(delay);
          }

        }
        if(!options || !options.tapAll)
          break;
      }
    }
    return result;
  };


  return {
    Step: Step,
    Steps: Steps,
    Templates: Templates,
    Image: Image
  }
})();
