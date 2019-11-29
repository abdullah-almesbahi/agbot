(function(){
  return{
    generatePath: function(options, funcA, funcB, moves){
      var pathArr = [];
      var newArr = [];
      gn.actions.Express();
      if(!options.skips)
        options.skips = 0;

      for (var i = 0; i < options.skips; i++) {

        var newFunc = this.createFunc(this.patterns[options.dir], undefined, undefined, moves);
        newArr.push(newFunc);
      }

      for (var i = 0; i < options.steps; i++) {

        var newFunc = this.createFunc(this.patterns[options.dir], funcA, funcB, moves);
        newArr.push(newFunc);
      }
      return newArr;
    },
    createFunc:function(a, b, c, d){
      return function(){
        if(a)
          a(b, c, d);
      }
    },
    checkMoveQueue:function(state, options, moves){
      if((state.queue.length <= 0 && state.directions.length > 0) || options.newPath == true){
        state.activeDir = state.directions[0];
        gn.tools.Log("Move direction set to " + state.directions[0], 0);
        state.queue = this.generatePath({dir: state.directions[0], steps:options.steps, skips:options.skips}, options.funcA, options.funcB, moves);
        state.directions.shift();
        if(options.recenter){
          options.recenter();
        }

        return true;
      }
      return false;
    },
    patterns:{
      up:function(a, b, moves){if(a)a(); moves.up(); if(b)b();},
      right:function(a, b, moves){if(a)a(); moves.right(); if(b)b();},
      down:function(a, b, moves){if(a)a();  moves.down(); if(b)b();},
      left:function(a, b, moves){if(a)a();  moves.left(); if(b)b();},
      upRight:function(a, b, moves){if(a)a();  moves.up(); moves.right();if(b)b();},
      upLeft:function(a, b, moves){if(a)a();  moves.up(); moves.left(); if(b)b();},
      downRight:function(a, b, moves){if(a)a(); moves.down(); moves.right(); if(b)b();},
      downLeft:function(a, b, moves){if(a)a();  moves.down(); moves.left(); if(b)b();},
    }
  }
})();
