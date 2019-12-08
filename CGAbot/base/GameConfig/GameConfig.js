(function(){
  var _f = IncludeExt("General/Framework/Framework.js");
  var Image = _f != null ? _f.Image : function (){ return null};
  return{
      views:{
        full:function(){return new Rectangle(1, 2, 395, 648)},
        search:function(){ return [new Rectangle(80, 68, 253, 215), new Rectangle(28, 296, 357, 206)]},
        title:function(){ return new Rectangle(90, 1, 211, 46)}
      },
      settings:{
        gather:{
          tapFirst:false,
          waitBeforeScan:2000,
          centerTileSpeed:3000,
          tapAfterMarchFail:function(){gn.player.input.Tap(100, 30)}
        },
        town:{
          recruitment:{
            uiHelper:true
          }
        }
      },
      maps:{
        town:{
          button:[
            new Image("TownButton1", 0.9, [4, 584, 54, 67]),
          ],
          indicators:[
            new Image("WorldButton1", 0.9, [4, 584, 54, 67]),
          ]
        },
        world:{
          button:[
            new Image("WorldButton1", 0.9, [4, 584, 54, 67]),
          ],
          indicators:[
            new Image("TownButton1", 0.9, [4, 584, 54, 67]),
          ]
        }
      },
      popups:{
        vipMenu:new Image('VipMenu', 0.9, [11, 413, 55, 51], {onTap: function(){ gn.player.input.tap(200, 50)}}),
        allianceHelp:new Image('AllianceHelp', 0.9, [295, 356, 96, 206]),
        singIn:new Image('SignIn', 0.9, [262, 587, 60, 54]),
        warSupport:new Image('WarSupport', 0.96, [340, 324, 58, 135], {onTap: function(){
          if(new Image('WarSupport', 0.94, [340, 324, 58, 135]).tap()){
            if(new Image('OkBtn', 0.9, [121, 505, 161, 104]).tap({tries:5, confirms:2})){
              Print('collect suffer gift')
            }
          }
        }}),
        // attackHelp:new Image('AttackHelp', 0.93, [174, 176, 51, 47], {onTap: function(){ gn.player.input.tap(200, 20)}}),
        reconnect:new Image('ReconnectBtn', 0.94, [238, 388, 55, 35]),
        rebuild:new Image('RebuildBtn', 0.94, [158, 386, 57, 39]),
        vip:new Image('VipUp', 0.93, [67, 183, 61, 65], {onTap: function(){ gn.player.input.tap(200, 10)}}),
        congrats:new Image('CongratsInfo', 0.9, [355, 70, 27, 303], {onTap: function(){ gn.player.input.tap(200, 10)}}),
        talkBox:new Image('TalkBox', 0.9, [347, 586, 37, 47]),
        yesBtn:new Image('YesBtn', 0.94, [179, 536, 38, 31]),
        listRight:new Image('ListRight', 0.96, [358, 242, 21, 100]),
        overview:new Image('Overview', 0.9, [294, 288, 48, 46]),
        //
        popup0:new Image('DialogX10', 0.9, [265, 5, 131, 288]),
        popup2:new Image('DialogX11', 0.9, [3, 16, 34, 35]),
        popup3:new Image('DialogX12', 0.9, [6, 23, 25, 22]),
        //
        yes:new Image('YesDownload', 0.94, [171, 385, 57, 37]),
        swordInfo:new Image('SwordInfo', 0.96, [0, 1, 399, 650], {onTap: function(){
          if(new Image('SwordInfo', 0.96, [0, 1, 399, 650]).find()){
            gn.tools.log('Wait for skip', 0);
            gn.tools.wait(30000);
          }
        }}),
        skipTutorial:new Image('SkipYes', 0.94, [87, 394, 49, 37]),
      }
    }
})();
