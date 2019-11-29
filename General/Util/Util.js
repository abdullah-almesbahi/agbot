(function(){
  return{
    defaults:{
      viewmain:function() {return new Rectangle(1, 2, 395, 648);},
      view:function(){ return [new Rectangle(4, 69, 307, 444), new Rectangle(289, 192, 104, 290)];},
      titleview:function(){ return new Rectangle(112, 1, 195, 49);}
    },
    findAndTap : function(img, sim, tries, confirms, area, offset, tapall){
      if(Array.isArray(img)){
        for(var i in img){
          var res = this.findAndTap(img[i], sim, tries, confirms, area, offset, tapall);
          if(res && !tapall)
            break;
        }
        return res;
      }
      if(Array.isArray(area)){
        for(var i in area){
          var res = this.findAndTap(img, sim, tries, confirms, area[i], offset, tapall);
          if(res && !tapall)
            break;
        }
        return res;
      }
      var val = gn.tools.images.TryFindInArea(img, sim ? sim : 0.90, area ? area : this.defaults.viewmain(), tries ? tries : 1, confirms ? confirms : 2);
      if(val.length > 0){
        if(tapall){
          val.forEach(function(el){
            gn.player.input.Tap(el.X + (offset ? offset.x : 0), el.Y + (offset ? offset.y : 0));
          });
        }else
          gn.player.input.Tap(val[0].X + (offset ? offset.x : 0), val[0].Y + (offset ? offset.y : 0));
        return true;
      }
      return false;
    },
    find:function(img, sim, tries, confirms, area, all){
      if(Array.isArray(img)){
        for(var i in img){
          var res = this.find(img[i], sim, tries, confirms, area, all);
          if(res && !all)
            break;
        }
        return res;
      }
      if(Array.isArray(area)){
        for(var i in area){
          var res = this.find(img, sim, tries, confirms, area[i], all);
          if(res && !all)
            break;
        }
        return res;
      }
      var val = gn.tools.images.TryFindInArea(img, sim ? sim : 0.90, area ? area : this.defaults.viewmain(), tries ? tries : 1, confirms ? confirms : 2);
      return (val.length > 0 ? val : null);
    },
    exec : function(q){
      if(q[0]){
        q[0]();
        q.shift();
        return true;
      }
      return false;
    },
    goals:function(completed){
      for (var i in completed) {
        if(Array.isArray(completed[i])){
          var res = true;
          completed[i].forEach(function(el){
            if(!goals(el))
              res = false;
          });
          if(!res)
            return false;
        }
        if(typeof completed[i] === "function"){
          return completed[i]();
        }else{
          if (!completed[i]) {
            return false;
          }
        }
      }
      return true;
    },
    fy : function(a,b,c,d){//array,placeholder,placeholder,placeholder
     c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
    },
    merge : function(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    },
    get : function(obj, path) {
      if(typeof path === 'string'){
        path = path.split('.');
      }


      if(path.length === 0) return obj;
      return this.get(obj[path[0]], path.slice(1));
    },
    hasTimeLeft : function(time, minutes){
      var result = 0;
      if(time){
        var now = gn.helper.Timestamp();
        result = (Number(time) + (Number(minutes) * 60)) - now;
      }
      return Number(result);
    },
    checkDay: function(daysObject, time){
      // time has to be a instance of Date!
      // daysObject has to be of format {monday: boolean, tuesday: boolean, ...}
      // Caution: gn.helper.timestamp() cannot be used to instantiate new Date( timestamp) unless multiplied by 1000
      let mapDay = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      }; 
      
      if (daysObject == undefined){
        return false;
      }
      
      let currTime = (time instanceof Date)? time : new Date();
      //Print(currTime.toUTCString());
      for (let i in mapDay){
        if (mapDay.hasOwnProperty(i)){
          Print(i +"(" + mapDay[i] + ")" + ": " + daysObject[i]);
          if (daysObject[i] && mapDay[i]==currTime.getUTCDay()){
            return true;
          }
        }
      }
      return false;
    },
    toArray: function(obj){
      var list = [];
      Object.keys(obj).forEach(function(el){
        list.push(obj[el]);
      });
      return list;
    },
    getRandomInt: function(min, max){
      return Math.floor(min + Math.random()*(max + 1 - min));
    },
    parseStringToKeyEvent: function (parseString){
//parses string to array of key event values
//currently only supports numbers. Add more keyValue pairs if needed.
      let parseDict = {
        '0': 7,
        '1': 8,
        '2': 9,
        '3': 10,
        '4': 11,
        '5': 12,
        '6': 13,
        '7': 14,
        '8': 15,
        '9': 16
      };
      let result = [];
      for (let i=0; i<parseString.length; i++){
        let c;
        c = parseDict[parseString[i]];
        if ( c != undefined){
          result.push(c);
        }
      }
      
      return result;
    }
  }

})();
