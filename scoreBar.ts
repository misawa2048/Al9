class ScoreBar{
  constructor(_myScene:Phaser.Scene, _posX:number, _posY:number){
    var cw=580,ch=40,rr=30;
    this.myScene = _myScene;
    this.container = _myScene.add.container(0,0);
    this.score=0;
    this.defaultPos = new Phaser.Math.Vector2(_posX,_posY);

    var graph = this.myScene.make.graphics({x: 0, y: 0, add: false});
    graph.fillStyle(0xccffff,1);
    graph.fillCircle(rr,rr,rr);
    graph.lineStyle(4, 0x444444, 0.5);
    graph.strokeCircle(rr,rr,rr-2);
    var circleTex: Phaser.GameObjects.Graphics;
    circleTex = graph.generateTexture('graphicsCircle', rr*2, rr*2);
    this.circleImage = _myScene.add.image(0, 0, 'graphicsCircle');
    this.container.add(this.circleImage);

    this.scoreText = this.myScene.add.text(0,0,this.score.toString());
    this.scoreText.setStyle(
      {
        fill: '#eeeeee',
        fontFamily: 'Arial',
        fontSize: 32,
        fontWeight: 'bold',
        stroke : '#c0c0c0',
        strokeThickness :1,
      }
    );
    this.scoreText.setOrigin(0.5);
    this.scoreText.setAlign('center');
    this.scoreText.setTint(0x0000cc, 0x4444ff, 0x0000cc, 0x4444ff);
    this.container.add(this.scoreText);

    this.myScene.sound.add(gRes.sePointUp);
    this.myScene.sound.add(gRes.sePointDoun);

    this.plusButton = createCustomButton(this.myScene, 80,0,60,50,5,"+","",48);
    this.plusButton.getByName("btnImg").setInteractive().on('pointerdown', function (this)
    {
      //console.log("plusButton");
      if(this.score<998){
        this.score = Math.min(999,this.score+1);
        this.scoreText.setText(this.score.toString());
        this.myScene.sound.play(gRes.sePointUp);
      }
    }.bind(this));
    this.container.add(this.plusButton);

    this.minusButton = createCustomButton(this.myScene, -80,0,60,50,5,"-","",48);
    this.minusButton.getByName("btnImg").setInteractive().on('pointerdown', function (this)
    {
      //console.log("minusButton");
      if(this.score>0){
        this.score = Math.max(0,this.score-1);
        this.scoreText.setText(this.score.toString());
        this.myScene.sound.play(gRes.sePointDoun);
      }
    }.bind(this));
    this.container.add(this.minusButton);

    this.container.setPosition(this.defaultPos.x, this.defaultPos.y);
  }

  myScene:Phaser.Scene;
  container : Phaser.GameObjects.Container;
  circleImage: Phaser.GameObjects.Image;
  plusButton: Phaser.GameObjects.Container;
  minusButton: Phaser.GameObjects.Container;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  defaultPos : Phaser.Math.Vector2;

  setPosByRate(_rate:number){
    var rateY = this.defaultPos.y + (-60 - this.defaultPos.y)*_rate;
    this.container.setPosition(this.defaultPos.x,rateY);
  }
  setInteractiveByFlag(_isset:boolean){
    if(_isset==true){
      this.plusButton.getByName("btnImg").setInteractive();
      this.minusButton.getByName("btnImg").setInteractive();
      console.debug("btnIntOn");
    }else{
      this.plusButton.getByName("btnImg").disableInteractive();
      this.minusButton.getByName("btnImg").disableInteractive();
      console.debug("btnIntOff");
    }
  }
} 
