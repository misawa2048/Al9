class TestScene extends Phaser.Scene {
  rpgatras:Phaser.GameObjects.Image
  map:any
  tileSprCnt:number
  playerSprite:any

  constructor() {
    super({ key: 'GameScene', active: false });
  }

  initialize ()
  {
  }
  preload(){
    //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
    this.load.setBaseURL('../assets'); // ./src/../assets
  }

  create ()
  {
    this.rpgatras = this.add.image(200, 200, 'rpgatras');
  
    this.map = this.createMap();
    this.map.x = this.map.y = 100;
    this.map.scaleX = this.map.scaleY = 8;
  
    this.playerSprite = this.setTileSprite();
    this.playerSprite.setInteractive();
    this.input.setDraggable(this.playerSprite);

    gSe = this.sound.add(gRes.seClick);
    gBgm = this.sound.add(gRes.bgmBgm);
    gBgm.detune=1600;
    gBgm.volume=0.1;
    gBgm.setLoop(true);
    //gBgm.play();

    // drag setup
    this.input.on('dragstart', function (pointer, gameObject) {
      console.log('dragstart');
    }, this);
  
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      console.log('drag'+dragX+","+dragY);
      gameObject.x = dragX;
      gameObject.y = dragY;
  }, this);
  
    this.input.on('dragend', function (pointer, gameObject, dropped) {
      console.log('dragend'+","+dropped);
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
  });
    }

  update ()
  {
    this.tileSprCnt = (this.tileSprCnt+1)&0xffff;
    this.playerSprite.tilePositionX = 32*((this.tileSprCnt>>4)&0xf);
    this.playerSprite.tilePositionY = 48*((this.tileSprCnt>>8)&0xf);
  
    this.map.angle+=1;
  }

  setTileSprite (){
    var tileSprite = this.add.tileSprite(100, 100, 16, 24, 'rpgatras');
    tileSprite.tilePositionX = 32*0;
    tileSprite.tilePositionY = 48*0;
    tileSprite.tileScaleX = 1;
    tileSprite.tileScaleY = 1;
    tileSprite.scaleX = 8;
    tileSprite.scaleY = 8;
    return tileSprite;
  }
  
  createMap(){
    var container = this.add.container(0, 0);
    for(var y=0; y<10; ++y){
      for(var x=0; x<10; ++x){
        var tileSprite = this.add.tileSprite((x-4)*8+4, (y-4)*8+4, 8, 8, 'rpgatras');
        tileSprite.tilePositionX = Math.floor(Math.random()*12)*8;
        tileSprite.tilePositionY = 64*3;
        container.add(tileSprite);
        tileSprite.tilePositionX = 0;
  
        // https://phaser.io/examples/v3/view/input/multitouch/multi-touch-test
        tileSprite.setInteractive();
        tileSprite.on('pointerdown', function () // 'pointerover'
        {
          this.tilePositionX = Math.floor(Math.random()*12)*8;
          gSe.play();
        });
      }
    }
    return container;
  }

}
//export default GameScene
