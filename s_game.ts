class GameScene extends Phaser.Scene {
  static readonly RN0_INIT=0;  // prepare
  static readonly RN0_WAIT=1;  // woit for shffle or select a card
  static readonly RN0_SHUFFLE=2; // shuffle
  static readonly RN0_SELECT_OPEN=3; // select a card and open
  static readonly RN0_SELECT_CLOSE=4; // select a card and close
  static readonly RN0_SELECT_DRAW=5; // draw selected card and score it

  rno:integer[]; // [0,0,0]
  cards: WordCard[];
  wordIdArr: integer[];
  shuffleButton: Phaser.GameObjects.Container;
  isOnShffleButton: boolean;
  isOnNextTurnButton: boolean;
  helpButton: Phaser.GameObjects.Container;
  resetButton: Phaser.GameObjects.Container;
  nextButton: Phaser.GameObjects.Container;
  onCardId: integer;
  isShuffling: boolean;
  isSelecting: boolean;
  isOpenClose: boolean;
  scoreBar:ScoreBar;
  shuffleRemain:number;
  graphicsCardSpr: Phaser.GameObjects.Graphics;
  waitText;

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
    this.sound.add(gRes.seClick);
    this.sound.add(gRes.seBook);
    this.sound.add(gRes.seDecide);
    this.input.on('pointerdown',this.onTouchStartFunc);

    this.isShuffling=false;
    this.isSelecting=false;
    this.isOpenClose=false;
    this.isOnShffleButton=false;
    this.isOnNextTurnButton=false;
    this.rno = [GameScene.RN0_INIT,0,0];

    var sx = gConfig.width*0.5;
    var sy = gConfig.height-100;
    this.shuffleRemain=gGame.o_shuffleNum;
    var shuffleStr = 'シャッフル:残り'+this.shuffleRemain;
    var shuffleFunc = (gGame.o_shuffleNum>0) ? 'onShuffleClick' : '';
    this.shuffleButton = createCustomButton(this,sx,sy,250,50,10,shuffleStr,shuffleFunc);
    this.shuffleButton.setVisible(gGame.o_shuffleNum>0);

    this.cards=[];
    this.wordIdArr=[];
  }

  update ()
  {
    switch(this.rno[0]){
    case GameScene.RN0_INIT:  // prepare
      if(this.rno[1]==0){
        this.rno[1]=1
        this.waitText = this.add.text(gConfig.width*0.5-25, gConfig.height*0.5, 'wait...', { font: '24px Arial', fill: '#9f9f9f', align:'center' });
        this.waitText.setTint(0xffffff, 0xffff00, 0xeeeeff, 0xffee00);
      
      }else{
        this.rno = [GameScene.RN0_WAIT,0,0];
        var cw=480,ch=640,rr=40;
        var graphCard = this.make.graphics({x: 0, y: 0, add: false});
        graphCard.fillStyle(0xffffff,1);
        graphCard.fillRoundedRect(0,0,cw,ch,rr);
        graphCard.lineStyle(5, 0x444444, 0.5);
        graphCard.strokeRoundedRect(0,0,cw,ch,rr);
        this.graphicsCardSpr = graphCard.generateTexture('graphicsCardSpr', cw, ch);
        
        for(var y=0;y<3;y+=1){
          for(var x=0;x<3;x+=1){
            var str='';
            do{
              str = this.selectRandomStr(1,this.getMaxCharByGrade(gGame.o_grade)+1);
            }while(str=='');
            var px = gConfig.width*0.5 + (x-(3-1)*0.5)/(3-1) * 300;
            var py = (gConfig.height-0)*0.5 + (y-(3-1)*0.5)/(3-1) * 400;
            var card = new WordCard(this,'graphicsCardSpr');
            card.createCard(y*3+x,px,py,0.25,str,'onCardClick');
            this.cards.push(card);
          }
        }
    
        this.resetButton = createCustomButton(this,40,75,60,50,5,'リセット','onResetClick',12);
        this.helpButton = createCustomButton(this,gConfig.width-40,75,60,50,5,'ヘルプ','onHelpClick',16);
        this.nextButton = createCustomButton(this,gConfig.width-120,75,60,50,5,'次のターン','onNextClick',10);
    
        this.scoreBar = new ScoreBar(this,gConfig.width*0.5, 75);
        this.scoreBar.container.add(this.nextButton);
        this.nextButton.setPosition(170,0);
        this.scoreBar.setPosByRate(1.0);
        this.waitText.setText('');
        console.log("tomove");
      }
      break;
    case GameScene.RN0_WAIT:  // woit for shffle or select a card
      if(this.isOnShffleButton){
        this.rno = [GameScene.RN0_SHUFFLE,0,0];
      }else if(this.onCardId>=0){
        this.rno = [GameScene.RN0_SELECT_OPEN,0,this.onCardId];
      }
      break;
    case GameScene.RN0_SHUFFLE: // shuffle
      switch(this.rno[1]){
      case 0:
        this.rno[1]=1;
        this.rno[2]=0;
        this.isOnShffleButton=false;
        this.isShuffling=true;
        this.onCardId=-1;
        this.sound.play(gRes.seBook);
        //console.log("length="+this.cards.length);
        this.wordIdArr=[];
        break;
      case 1:
        if(this.rno[2]<this.cards.length){
          this.shuffleOne(this.rno[2],gGame.o_grade);
          this.rno[2]++;
        }else{
          this.isShuffling=false;
          this.rno = [GameScene.RN0_WAIT,0,0];
        }
        break;
      }
      break;
    case GameScene.RN0_SELECT_OPEN: // select a card and open
      switch(this.rno[1]){
      case 0:
        this.rno[1]=1;
        //this.rno[2]=0; cardId
        this.isOpenClose=true;
        this.onCardId=-1;
        //this.scoreBar.setInteractiveByFlag(false);
        this.children.bringToTop(this.cards[this.rno[2]].cardContainer);
        this.sound.play(gRes.seClick);
        break;
      case 1:
        var tmpCard = this.cards[this.rno[2]]; // cardId
        var tmpScl = tmpCard.cardContainer.scaleX;
        tmpScl = Math.min(tmpScl+0.1,1);
        tmpCard.cardContainer.setScale(tmpScl);
        var rate = (tmpScl-tmpCard.defaultScale)/(1.0-tmpCard.defaultScale);
        var ratePos:Phaser.Math.Vector2 = this.getRatePos(tmpCard.defaultPos,this.cards[4].defaultPos,rate);
        tmpCard.cardContainer.setPosition(ratePos.x,ratePos.y);
        this.setShuffleButtonPosByRate(rate);
        this.scoreBar.setPosByRate(1.0-rate);
        if(tmpScl>=1){
          this.rno = [GameScene.RN0_SELECT_CLOSE,0,this.rno[2]]; //,,onCardId
          this.onCardId=-1;
          this.isOpenClose=false;
        }
        break;
      }
      break;
    case GameScene.RN0_SELECT_CLOSE: // select a card and close
      switch(this.rno[1]){
      case 0:
        if(this.onCardId==this.rno[2]){
          this.rno[1]=1;
          this.isOpenClose=true;
          this.onCardId=-1;
          this.sound.play(gRes.seClick);
          //this.scoreBar.setInteractiveByFlag(true);
        }else if(this.isOnNextTurnButton==true){
          this.rno[1]=1;
          this.isOpenClose=true;
          this.sound.play(gRes.seNewspaper);
        }
        break;
      case 1:
        var tmpCard = this.cards[this.rno[2]]; // cardId
        var tmpScl = tmpCard.cardContainer.scaleX;
        tmpScl = Math.max(tmpScl-0.1,tmpCard.defaultScale);
        tmpCard.cardContainer.setScale(tmpScl);
        var rate = (tmpScl-tmpCard.defaultScale)/(1.0-tmpCard.defaultScale);
        var ratePos:Phaser.Math.Vector2 = this.getRatePos(tmpCard.defaultPos,this.cards[4].defaultPos,rate);
        tmpCard.cardContainer.setPosition(ratePos.x,ratePos.y);
        this.setShuffleButtonPosByRate(rate);
        this.scoreBar.setPosByRate(1.0-rate);
        if(tmpScl<=tmpCard.defaultScale){
          if(this.isOnNextTurnButton==true){
            this.rno = [GameScene.RN0_SHUFFLE,0,0];
            this.isOnNextTurnButton=false;
            this.isOnShffleButton=false;
            this.shuffleRemain=gGame.o_shuffleNum;
            (this.shuffleButton.getByName('btnTxt') as Phaser.GameObjects.Text).setText('シャッフル:残り'+this.shuffleRemain);
          }else{
            this.rno = [GameScene.RN0_WAIT,0,0];
          }
          this.onCardId=-1;
          this.isOpenClose=false;
      }
        break;
      }
      break;
    case GameScene.RN0_SELECT_DRAW: // draw selected card and score it
      break;
    }
  }

  shuffleImmediate(){
    this.isShuffling=true;
    this.sound.play(gRes.seBook);
    console.log("length="+this.cards.length);
    this.wordIdArr=[];
    for(var i=0; i<this.cards.length; ++i){
      this.shuffleOne(i,gGame.o_grade);
    }
    this.isShuffling=false;
  }

  getMaxCharByGrade(_grade:integer){
    var gradeLimitArr = [1006,80,240,441,640,825,1006]; // 0(all),1,2,3,4,5,6
    _grade = Math.min(Math.max(_grade,1),6);
    console.log("grade="+_grade);
    var selMax = gradeLimitArr[_grade];
    return Math.min(selMax+1,gWordArr.length);
  }

  shuffleOne(_cardId:integer,_grade:integer){
    var str = this.selectRandomStr(1,this.getMaxCharByGrade(_grade));
    this.cards[_cardId].setString(str);
  }

  selectRandomStr(_start:integer,_end:integer){
    _start = Math.max(1,Math.min(_start,gWordArr.length));
    _end = Math.max(1,Math.min(_end,gWordArr.length));
    if(_start>=_end){
      _start=1;
      _end = gWordArr.length;
    }
    var size:integer = _end-_start;
    var r:integer;
    do{
      r =  Math.floor(Math.random() * size)+1;
    }while(this.isOverlap(r))
    this.wordIdArr.push(r);
    return gWordArr[r].split(',')[0];
  }

  isOverlap(_id:integer){
    var ret:boolean = false;
    for(var i=0;i< this.wordIdArr.length;++i){
      if(_id==this.wordIdArr[i]){
        ret = true;
        break;
      }
    }
    return ret;
  }

  getRatePos(_sttPos:Phaser.Math.Vector2, _endPos:Phaser.Math.Vector2, _rate:number){
    var ratePosX:number = (_sttPos.x+(_endPos.x-_sttPos.x)*_rate);
    var ratePosY:number = (_sttPos.y+(_endPos.y-_sttPos.y)*_rate);
    return new Phaser.Math.Vector2(ratePosX,ratePosY);
  }

  onCardClick(_card:WordCard){
    if(!this.isOpenClose){
      this.onCardId = _card.cardId;
      console.log('button on['+_card.cardId+']');
    }
  }

  setShuffleButtonPosByRate(_rate:number){
    var sx = gConfig.width*0.5;
    var sy_stt = gConfig.height-100;
    var sy_end = gConfig.height-200;
    this.shuffleButton.setPosition(sx,sy_stt+(sy_end-sy_stt)*_rate);
  }
  onTouchStartFunc(){
    if (gGame.sound.context.state ==='suspended') {
      console.log("touchStart");
      gGame.sound.context.resume();
      gGame.sound.play(gRes.seMute);
    }
  }
  onShuffleClick(_button:Phaser.GameObjects.Container){
    console.log("onShuffleClick");
    if(this.rno[0] == GameScene.RN0_WAIT){
      if(this.shuffleRemain>0){
        this.shuffleRemain--;        
        (this.shuffleButton.getByName('btnTxt') as Phaser.GameObjects.Text).setText('シャッフル:残り'+this.shuffleRemain);
        if(this.shuffleRemain<=0){
          this.shuffleButton.getByName('btnImg').disableInteractive();
        }
      }
      this.isOnShffleButton=true;
    }
  }
  onHelpClick(_button:Phaser.GameObjects.Container){
    this.sound.play(gRes.seDecide);
    var query = '?nGrade='+gGame.o_grade+'&nShuffle='+gGame.o_shuffleNum+'';
    var win = window.open('./help.html'+query+'&isTab=true','_help');
    if(win==null){
      if(window.confirm('新しいウインドウが開けませんでした。ゲームを終了して別画面へ遷移しますか？')){
        window.location.href = './help.html'+query;
      }else{}
    }
}
  onResetClick(_button:Phaser.GameObjects.Container){
    this.sound.play(gRes.seDecide);
    if(window.confirm('ゲームを終了してタイトル画面に戻ります')){
      var query = '?nGrade='+gGame.o_grade+'&nShuffle='+gGame.o_shuffleNum+'';
      window.location.href = './index.html'+query;
    }else{}
  }
  onNextClick(_button:Phaser.GameObjects.Container){
    if(window.confirm('シャッフルして次のターンに移ります')){
      this.isOnNextTurnButton=true;
      this.shuffleButton.getByName('btnImg').setInteractive();
      //this.shuffleImmediate();
    }else{}
  }
}
//export default GameScene
