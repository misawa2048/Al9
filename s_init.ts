class InitScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InitScene', active: true });
  }
  initialize ()
  {
  }
  preload(){
    //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
    this.load.setBaseURL('./assets'); // ../assets
    this.load.image(gRes.imgBgSky, 'skies/space3.png');
    this.load.image(gRes.imgRpgatras,'sprites/rpgcharset.png');
    this.load.audio(gRes.seDecide, ['audio/tm2_coin000.wav'],{ instances: 1 });
    this.load.audio(gRes.seClick, ['audio/tm2_counter000.wav'],{ instances: 1 });
    this.load.audio(gRes.seMute, ['audio/mute.wav','audio/mute.mp3'],{instances: 1});
    this.load.audio(gRes.sePointUp, ['audio/wallet1.mp3'],{instances: 1});
    this.load.audio(gRes.sePointDoun, ['audio/pointdown.wav'],{instances: 1});
    this.load.audio(gRes.seBook, ['audio/tm2_book001.wav'],{instances: 1});
    this.load.audio(gRes.seNewspaper, ['audio/newspaper-take1.mp3'],{instances: 1});
    this.load.audio(gRes.bgmBgm, ['audio/bgm_heal.ogg', 'audio/bgm_heal.mp3'],{instances: 1});
    //http://www17408ui.sakura.ne.jp/tatsum/database.html
    this.load.text(gRes.txtWords, 'texts/jp_primaryschool.csv');
  }

  create ()
  {
    //  Using the Scene Data Plugin we can store data on a Scene level
    let cache = this.cache.text;
    let textCSV = cache.get(gRes.txtWords);
    gWordArr = textCSV.split('\n');

    this.data.set('score', 2000);
    //this.scene.run('TitleScene');
    //this.scene.start('TitleScene');
    this.scene.start('GameScene');
  }

  update ()
  {
    // this will be works when use this.scene.run().
    console.log("init_update");
  }
}
//export default SystemScene

