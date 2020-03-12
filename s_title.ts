class TitleScene extends Phaser.Scene {
  bg:Phaser.GameObjects.Image;
  startButton:Phaser.GameObjects.TileSprite;
  toQRPageButton: Phaser.GameObjects.Container;
  shuffleButton: Phaser.GameObjects.Container;
  rno:integer[];
  
  constructor() {
    super({ key: 'TitleScene', active: false });
  }
  //initialize (){ Phaser.Scene.call(this,{key:'TitleScene'}); }
  preload(){
    //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
    this.load.setBaseURL('../assets'); // ./src/../assets
}

  getPosition ()
  {
      let x = Phaser.Math.Between(0, 800);
      let y = Phaser.Math.Between(0, 600);
      return new Phaser.Math.Vector2(x, y);
  }

  create ()
  {
    this.rno=[0,0,0];
    this.sound.add(gRes.seDecide);
    this.sound.add(gRes.seMute);
  }

  update ()
  {
    switch(this.rno[0]){
      case 0: this.updateInit(); break;
      case 1: this.updateMove(); break;
    }
  }

  createStartButton(){
    var ts : Phaser.GameObjects.TileSprite;
    ts = this.add.tileSprite(500, gConfig.height-30, 16*10, 24, 'rpgatras');
    ts.tilePositionX = 32*0;
    ts.tilePositionY = 48*0;
    ts.scaleX = ts.scaleY = 2;
    ts.setInteractive();
    ts.on('pointerdown', function (this,ts) // 'pointerover'
    {
      console.log('button on');
      this.sound.play(gRes.seMute);
      this.sound.play(gRes.seDecide);
      this.scene.run('GameScene');
      this.scene.stop('TitleScene');
    }.bind(this,ts));
    return ts;
  }

  updateInit(){
    this.rno[0]=1;
    this.bg = this.add.image(100, 0, 'bgSky');

    this.startButton = this.createStartButton();
    this.toQRPageButton = createCustomButton(this,300,200,200,40,5,'test','onQrPageButton');
    this.shuffleButton = createCustomButton(this,250,700,200,40,5,'shuffle','onShuffleClick');

    var test = new ScoreBar(this,200,500);
    test.container.setPosition(200,500);
  }

  updateMove(){
  }
  onCardClick(_card:WordCard){
    console.log('button on['+_card.cardId+']');
  }
  onShuffleClick(_button:Phaser.GameObjects.Container){
    this.sound.play(gRes.seDecide);
  }
  onQrPageButton(_button:Phaser.GameObjects.Container){
    window.location.href = './qr.html';
  }
}
//export default TitleScene

function createCustomButton(_scene, _x,_y,_w,_h,_r,_text,_onFunc:string='',_fontSize=24,_bgCol=0xffffff,_fontCol='#0f0f0f'){
  var con = _scene.add.container(_x,_y);
  var graphButton = _scene.make.graphics({x: 0, y: 0, add: false});;
  graphButton.fillStyle(_bgCol,1);
  graphButton.fillRoundedRect(0,0,_w,_h,_r);
  graphButton.lineStyle(5, 0x444444, 0.5);
  graphButton.strokeRoundedRect(0,0,_w,_h,_r);
  var graphicsButtonTex = graphButton.generateTexture('grpButton'+_scene.name+_text, _w, _h);
  var img = _scene.add.image(0, 0, 'grpButton'+_scene.name+_text);
  img.name="btnImg";
  var buttonText = _scene.add.text(0, 0, _text, 
    {
       fill: _fontCol,
       fontFamily: 'Arial', 
       fontWeight: 'bold',
    }
  ).setFontSize(_fontSize).setOrigin(0.5);
  buttonText.name="btnTxt";
  con.add([img,buttonText]);
  if(_onFunc!=''){
    img.setInteractive();
    img.on('pointerdown', function (this)
    {
      eval('this.'+_onFunc+'(this)');
    }.bind(_scene));
  }
  return con;
}

