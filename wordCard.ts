//-------------------------------------------------
class WordCard{
  constructor(_myScene, _cardSprTexStr='graphicsCardSpr'){
    this.myScene = _myScene;
    this.cardSprTexStr = _cardSprTexStr;
    /*
    var cw=480,ch=640,rr=40;
    var graphCard = this.myScene.make.graphics({x: 0, y: 0, add: false});
    graphCard.fillStyle(0xffffff,1);
    graphCard.fillRoundedRect(0,0,cw,ch,rr);
    graphCard.lineStyle(5, 0x444444, 0.5);
    graphCard.strokeRoundedRect(0,0,cw,ch,rr);
    var graphicsCardSpr: Phaser.GameObjects.Graphics = graphCard.generateTexture('graphicsCardSpr', cw, ch);
    */
  }

  myScene:Phaser.Scene;
  cardId:integer;
  cardContainer : Phaser.GameObjects.Container;
  cardImage :Phaser.GameObjects.Image; 
  letters = [];
  defaultScale : number;
  defaultPos : Phaser.Math.Vector2;
  cardSprTexStr : string;

  createCard(_id:integer, _x:number, _y:number,_scale:number, _string:string, _clickFunc:string=''){
    this.cardId=_id;
    var con = this.myScene.add.container(0,0);
    this.cardContainer = con;
    this.cardImage = this.myScene.add.image(0, 0, this.cardSprTexStr);
    this.cardContainer.add(this.cardImage);
    this.letters = [];
    this.defaultScale = _scale;
    this.defaultPos = new Phaser.Math.Vector2(_x,_y);
    this.setString(_string);
    
    con.x = _x;
    con.y = _y;
    con.setScale(_scale);
    if(_clickFunc!=''){
      this.cardImage.setInteractive();
      this.cardImage.on('pointerdown', function (this) // 'pointerover'
      {
        eval('this.myScene.'+_clickFunc+'(this)');
      }.bind(this));
    }
    return con;
  }

  setString(_string){
    this.removeString();
    var ch=640
    var slen = _string.length;
    var fsz = Math.floor(ch/(Math.max(2.5,slen)*1.2)); // 1文字の時は1/1.5
    for( var i=0; i < slen; ++i){
      var cardText = this.myScene.add.text(-0.5*fsz,(i*2-slen)*0.5*fsz,_string[i]);
      cardText.setStyle(
        {
          fill: '#eeeeee',
          fontFamily: 'Arial',
          fontSize: fsz,
          fontWeight: 'bold',
          stroke : '#c0c0c0',
          strokeThickness :4,
          align: 'center',  // 'left'|'center'|'right'|'justify'
          //origin: 0.5,
          //antialias: true,
          //        wordWrap: { width: 172, useAdvancedWrap: true }
        }
      );
      cardText.setTint(0x0000cc, 0x4444ff, 0x0000cc, 0x4444ff);
      if(_string[i]=='ー'||_string[i]=='…'){
        cardText.angle = 90;
        cardText.x += fsz;
      }
      this.cardContainer.add(cardText);
      this.letters.push(cardText)
    }
    //console.log("letters="+this.letters.length);
  }

  removeString(){
    for(var i=0; i < this.letters.length; ++i){
      this.letters[i].destroy();
    }
    this.letters = [];
  }
} 
