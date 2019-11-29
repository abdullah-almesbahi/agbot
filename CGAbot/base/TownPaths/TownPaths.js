(function(){ ////

  return{
    getPath: function(path, funcA, funcB){
      var pathArr = this.paths[path];
      var newArr = [];
      for (var i = 0; i < pathArr.length; i++) {
        var newFunc = this.createFunc(pathArr[i], funcA, funcB);
        newArr.push(newFunc);
      }
      return newArr;
    },
    createFunc:function(a, b, c){
      return function(){
        if(a)
        a(b, c);
      }
    },
    paths:{
      productions:[
        function(){_town.cfg.startRef = "bottomLeft"; _town.resetStart();},
        function(a){a(); _base.move.town.right(); },
        function(a){a(); _base.move.town.right(); },
        function(a){a(); _base.move.town.left (); a();},
      ],
      recruitment:[
        function(){_town.cfg.startRef = "topLeft"; _town.resetStart();},
        function(a){ _base.move.town.down(); },
        function(a){ _base.move.town.right(); },
        function(a){ _base.move.town.right(); a(); },
        function(a){ _base.move.town.right(); a(); },
        function(a){ _base.move.town.right(); a(); },
        function(a){ _base.move.town.down(); a(); },
        function(a){ _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
      ],
      mainHall:[
        function(){ _town.cfg.startRef = "topLeft"; _town.resetStart();},
        function(a){ a(); },
        function(a){ a(); },
      ],
      dailies:[
        function(){_town.cfg.startRef = "topLeft"; _town.resetStart();},
        // function(a){ _base.move.town.down(); a(); },
        function(a){ _base.move.town.right();},
        function(a){ _base.move.town.right();},
        function(a){ _base.move.town.right();},
        function(a){ _base.move.town.right();},
        function(a){a(); _base.move.town.down(); a(); },
        function(a){a(); _base.move.town.down(); a(); },
        function(a){a(); _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
        function(a){ _base.move.town.left(); a(); },
      ],
      wall:[
        function(){ _town.cfg.startRef = "bottomRight"; _town.resetStart();},
        function(a){ a(); },
        function(a){ a(); },
        function(a){ a(); },
      ],
    }
  }
})();
