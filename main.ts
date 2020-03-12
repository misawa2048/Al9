/// <reference path="s_init.ts"/>
/// <reference path="s_system.ts"/>
/// <reference path="s_title.ts"/>
/// <reference path="s_game.ts"/>

var gRes = {
  imgBgSky: 'bgSky',
  imgRpgatras: 'rpgatras',
  seMute: 'se_mute',
  seDecide: 'se_decide',
  seClick: 'se_click',
  seBook: 'se_book',
  seNewspaper: 'se_newspaper',
  sePointUp: 'se_pointup',
  sePointDoun: 'se_pointdown',
  bgmBgm: 'bgm',
  txtWords: 'wordList',
}
//window.document.body.onload=p3onLoad;
var gConfig = {
  //mode: Phaser.Scale.RESIZE,
  //scaleMode:Phaser.ScaleModes.DEFAULT,
  //scale:Phaser.Scale.FIT,
  type: Phaser.AUTO,
  parent: 'iPhaser3Content',
  width: 600, //window.innerWidth,
  height: 900, //window.innerHeight,
  pixelArt: false,
  //antialias: false,
  //roundPixels: false,

  audio: {
    disableWebAudio: false
  },
  fps: {
    target: 10,
  },
  scene: [InitScene, GameScene, SystemScene, ],

  //  The version of your game appears after the title in the banner
  title: 'MyTest',
  version: '1.0.0'
};

var gGame = null;
var gBgm = null;
var gSe = null;
var gWordArr = null;

function p3onLoad(){
  gGame = new Phaser.Game(gConfig);

  var vars = getUrlVars();
  gGame.o_shuffleNum = (!(typeof vars["nShuffle"] === "undefined")) ? vars["nShuffle"] : 3;
  gGame.o_grade = (!(typeof vars["nGrade"] === "undefined")) ? vars["nGrade"] : 6;
  gGame.o_isResized = false;
  gGame.o_resizeWindow = resizeWindow;
  gGame.o_resizeWindow();

  gGame.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
    console.log(displaySize+":"+resolution);
    gGame.o_isResized = true;
  });

}

function resizeWindow(){
  var topContainer = window.document.getElementById('iPhaser3Content');
  var contentSize = {x:topContainer.clientWidth, y:topContainer.clientHeight}; 
  // _winにcanvasをfitさせるscale
  var fitScale = Math.min(contentSize.x / gConfig.width,contentSize.y / gConfig.height);
  gGame.scale.setZoom(fitScale);
  gGame.scale.updateScale(); //.resize(700,600);
}

function getUrlVars(){
  var vars = {}; 
  var param = location.search.substring(1).split('&');
  for(var i = 0; i < param.length; i++) {
      var keySearch = param[i].search(/=/);
      var key = '';
      if(keySearch != -1) key = param[i].slice(0, keySearch);
      var val = param[i].slice(param[i].indexOf('=', 0) + 1);
      if(key != '') vars[key] = decodeURI(val);
  } 
  return vars; 
}

//> Set-ExecutionPolicy Restricted
