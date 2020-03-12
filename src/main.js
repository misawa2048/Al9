class InitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InitScene', active: true });
    }
    initialize() {
    }
    preload() {
        //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
        this.load.setBaseURL('./assets'); // ../assets
        this.load.image(gRes.imgBgSky, 'skies/space3.png');
        this.load.image(gRes.imgRpgatras, 'sprites/rpgcharset.png');
        this.load.audio(gRes.seDecide, ['audio/tm2_coin000.wav'], { instances: 1 });
        this.load.audio(gRes.seClick, ['audio/tm2_counter000.wav'], { instances: 1 });
        this.load.audio(gRes.seMute, ['audio/mute.wav', 'audio/mute.mp3'], { instances: 1 });
        this.load.audio(gRes.sePointUp, ['audio/wallet1.mp3'], { instances: 1 });
        this.load.audio(gRes.sePointDoun, ['audio/pointdown.wav'], { instances: 1 });
        this.load.audio(gRes.seBook, ['audio/tm2_book001.wav'], { instances: 1 });
        this.load.audio(gRes.seNewspaper, ['audio/newspaper-take1.mp3'], { instances: 1 });
        this.load.audio(gRes.bgmBgm, ['audio/bgm_heal.ogg', 'audio/bgm_heal.mp3'], { instances: 1 });
        //http://www17408ui.sakura.ne.jp/tatsum/database.html
        this.load.text(gRes.txtWords, 'texts/jp_primaryschool.csv');
    }
    create() {
        //  Using the Scene Data Plugin we can store data on a Scene level
        let cache = this.cache.text;
        let textCSV = cache.get(gRes.txtWords);
        gWordArr = textCSV.split('\n');
        this.data.set('score', 2000);
        //this.scene.run('TitleScene');
        //this.scene.start('TitleScene');
        this.scene.start('GameScene');
    }
    update() {
        // this will be works when use this.scene.run().
        console.log("init_update");
    }
}
//export default SystemScene
class SystemScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SystemScene', active: true });
    }
    initialize() {
    }
    preload() {
    }
    create() {
        /*
        var text = this.add.text(gConfig.width*0.5, gConfig.height-60, '', { font: '24px Arial', fill: '#9f9f9f' });
        text.setText([
            'Game title: ' + gGame.config.gameTitle,
            'Version: ' + gGame.config.gameVersion
        ]);
        //text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        text.setTint(0xffffff, 0xffff00, 0xffffff, 0xffffff);
        */
    }
    update() {
        if (gGame.o_isResized) {
            gGame.o_resizeWindow();
            gGame.o_isResized = false;
        }
    }
}
//export default SystemScene
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene', active: false });
    }
    //initialize (){ Phaser.Scene.call(this,{key:'TitleScene'}); }
    preload() {
        //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
        this.load.setBaseURL('../assets'); // ./src/../assets
    }
    getPosition() {
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(0, 600);
        return new Phaser.Math.Vector2(x, y);
    }
    create() {
        this.rno = [0, 0, 0];
        this.sound.add(gRes.seDecide);
        this.sound.add(gRes.seMute);
    }
    update() {
        switch (this.rno[0]) {
            case 0:
                this.updateInit();
                break;
            case 1:
                this.updateMove();
                break;
        }
    }
    createStartButton() {
        var ts;
        ts = this.add.tileSprite(500, gConfig.height - 30, 16 * 10, 24, 'rpgatras');
        ts.tilePositionX = 32 * 0;
        ts.tilePositionY = 48 * 0;
        ts.scaleX = ts.scaleY = 2;
        ts.setInteractive();
        ts.on('pointerdown', function (ts) {
            console.log('button on');
            this.sound.play(gRes.seMute);
            this.sound.play(gRes.seDecide);
            this.scene.run('GameScene');
            this.scene.stop('TitleScene');
        }.bind(this, ts));
        return ts;
    }
    updateInit() {
        this.rno[0] = 1;
        this.bg = this.add.image(100, 0, 'bgSky');
        this.startButton = this.createStartButton();
        this.toQRPageButton = createCustomButton(this, 300, 200, 200, 40, 5, 'test', 'onQrPageButton');
        this.shuffleButton = createCustomButton(this, 250, 700, 200, 40, 5, 'shuffle', 'onShuffleClick');
        var test = new ScoreBar(this, 200, 500);
        test.container.setPosition(200, 500);
    }
    updateMove() {
    }
    onCardClick(_card) {
        console.log('button on[' + _card.cardId + ']');
    }
    onShuffleClick(_button) {
        this.sound.play(gRes.seDecide);
    }
    onQrPageButton(_button) {
        window.location.href = './qr.html';
    }
}
//export default TitleScene
function createCustomButton(_scene, _x, _y, _w, _h, _r, _text, _onFunc = '', _fontSize = 24, _bgCol = 0xffffff, _fontCol = '#0f0f0f') {
    var con = _scene.add.container(_x, _y);
    var graphButton = _scene.make.graphics({ x: 0, y: 0, add: false });
    ;
    graphButton.fillStyle(_bgCol, 1);
    graphButton.fillRoundedRect(0, 0, _w, _h, _r);
    graphButton.lineStyle(5, 0x444444, 0.5);
    graphButton.strokeRoundedRect(0, 0, _w, _h, _r);
    var graphicsButtonTex = graphButton.generateTexture('grpButton' + _scene.name + _text, _w, _h);
    var img = _scene.add.image(0, 0, 'grpButton' + _scene.name + _text);
    img.name = "btnImg";
    var buttonText = _scene.add.text(0, 0, _text, {
        fill: _fontCol,
        fontFamily: 'Arial',
        fontWeight: 'bold',
    }).setFontSize(_fontSize).setOrigin(0.5);
    buttonText.name = "btnTxt";
    con.add([img, buttonText]);
    if (_onFunc != '') {
        img.setInteractive();
        img.on('pointerdown', function () {
            eval('this.' + _onFunc + '(this)');
        }.bind(_scene));
    }
    return con;
}
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene', active: false });
    }
    initialize() {
    }
    preload() {
        //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
        this.load.setBaseURL('../assets'); // ./src/../assets
    }
    create() {
        this.sound.add(gRes.seClick);
        this.sound.add(gRes.seBook);
        this.sound.add(gRes.seDecide);
        this.input.on('pointerdown', this.onTouchStartFunc);
        this.isShuffling = false;
        this.isSelecting = false;
        this.isOpenClose = false;
        this.isOnShffleButton = false;
        this.isOnNextTurnButton = false;
        this.rno = [GameScene.RN0_INIT, 0, 0];
        var sx = gConfig.width * 0.5;
        var sy = gConfig.height - 100;
        this.shuffleRemain = gGame.o_shuffleNum;
        var shuffleStr = 'シャッフル:残り' + this.shuffleRemain;
        var shuffleFunc = (gGame.o_shuffleNum > 0) ? 'onShuffleClick' : '';
        this.shuffleButton = createCustomButton(this, sx, sy, 250, 50, 10, shuffleStr, shuffleFunc);
        this.shuffleButton.setVisible(gGame.o_shuffleNum > 0);
        this.cards = [];
        this.wordIdArr = [];
    }
    update() {
        switch (this.rno[0]) {
            case GameScene.RN0_INIT: // prepare
                if (this.rno[1] == 0) {
                    this.rno[1] = 1;
                    this.waitText = this.add.text(gConfig.width * 0.5 - 25, gConfig.height * 0.5, 'wait...', { font: '24px Arial', fill: '#9f9f9f', align: 'center' });
                    this.waitText.setTint(0xffffff, 0xffff00, 0xeeeeff, 0xffee00);
                }
                else {
                    this.rno = [GameScene.RN0_WAIT, 0, 0];
                    var cw = 480, ch = 640, rr = 40;
                    var graphCard = this.make.graphics({ x: 0, y: 0, add: false });
                    graphCard.fillStyle(0xffffff, 1);
                    graphCard.fillRoundedRect(0, 0, cw, ch, rr);
                    graphCard.lineStyle(5, 0x444444, 0.5);
                    graphCard.strokeRoundedRect(0, 0, cw, ch, rr);
                    this.graphicsCardSpr = graphCard.generateTexture('graphicsCardSpr', cw, ch);
                    for (var y = 0; y < 3; y += 1) {
                        for (var x = 0; x < 3; x += 1) {
                            var str = '';
                            do {
                                str = this.selectRandomStr(1, this.getMaxCharByGrade(gGame.o_grade) + 1);
                            } while (str == '');
                            var px = gConfig.width * 0.5 + (x - (3 - 1) * 0.5) / (3 - 1) * 300;
                            var py = (gConfig.height - 0) * 0.5 + (y - (3 - 1) * 0.5) / (3 - 1) * 400;
                            var card = new WordCard(this, 'graphicsCardSpr');
                            card.createCard(y * 3 + x, px, py, 0.25, str, 'onCardClick');
                            this.cards.push(card);
                        }
                    }
                    this.resetButton = createCustomButton(this, 40, 75, 60, 50, 5, 'リセット', 'onResetClick', 12);
                    this.helpButton = createCustomButton(this, gConfig.width - 40, 75, 60, 50, 5, 'ヘルプ', 'onHelpClick', 16);
                    this.nextButton = createCustomButton(this, gConfig.width - 120, 75, 60, 50, 5, '次のターン', 'onNextClick', 10);
                    this.scoreBar = new ScoreBar(this, gConfig.width * 0.5, 75);
                    this.scoreBar.container.add(this.nextButton);
                    this.nextButton.setPosition(170, 0);
                    this.scoreBar.setPosByRate(1.0);
                    this.waitText.setText('');
                    console.log("tomove");
                }
                break;
            case GameScene.RN0_WAIT: // woit for shffle or select a card
                if (this.isOnShffleButton) {
                    this.rno = [GameScene.RN0_SHUFFLE, 0, 0];
                }
                else if (this.onCardId >= 0) {
                    this.rno = [GameScene.RN0_SELECT_OPEN, 0, this.onCardId];
                }
                break;
            case GameScene.RN0_SHUFFLE: // shuffle
                switch (this.rno[1]) {
                    case 0:
                        this.rno[1] = 1;
                        this.rno[2] = 0;
                        this.isOnShffleButton = false;
                        this.isShuffling = true;
                        this.onCardId = -1;
                        this.sound.play(gRes.seBook);
                        //console.log("length="+this.cards.length);
                        this.wordIdArr = [];
                        break;
                    case 1:
                        if (this.rno[2] < this.cards.length) {
                            this.shuffleOne(this.rno[2], gGame.o_grade);
                            this.rno[2]++;
                        }
                        else {
                            this.isShuffling = false;
                            this.rno = [GameScene.RN0_WAIT, 0, 0];
                        }
                        break;
                }
                break;
            case GameScene.RN0_SELECT_OPEN: // select a card and open
                switch (this.rno[1]) {
                    case 0:
                        this.rno[1] = 1;
                        //this.rno[2]=0; cardId
                        this.isOpenClose = true;
                        this.onCardId = -1;
                        //this.scoreBar.setInteractiveByFlag(false);
                        this.children.bringToTop(this.cards[this.rno[2]].cardContainer);
                        this.sound.play(gRes.seClick);
                        break;
                    case 1:
                        var tmpCard = this.cards[this.rno[2]]; // cardId
                        var tmpScl = tmpCard.cardContainer.scaleX;
                        tmpScl = Math.min(tmpScl + 0.1, 1);
                        tmpCard.cardContainer.setScale(tmpScl);
                        var rate = (tmpScl - tmpCard.defaultScale) / (1.0 - tmpCard.defaultScale);
                        var ratePos = this.getRatePos(tmpCard.defaultPos, this.cards[4].defaultPos, rate);
                        tmpCard.cardContainer.setPosition(ratePos.x, ratePos.y);
                        this.setShuffleButtonPosByRate(rate);
                        this.scoreBar.setPosByRate(1.0 - rate);
                        if (tmpScl >= 1) {
                            this.rno = [GameScene.RN0_SELECT_CLOSE, 0, this.rno[2]]; //,,onCardId
                            this.onCardId = -1;
                            this.isOpenClose = false;
                        }
                        break;
                }
                break;
            case GameScene.RN0_SELECT_CLOSE: // select a card and close
                switch (this.rno[1]) {
                    case 0:
                        if (this.onCardId == this.rno[2]) {
                            this.rno[1] = 1;
                            this.isOpenClose = true;
                            this.onCardId = -1;
                            this.sound.play(gRes.seClick);
                            //this.scoreBar.setInteractiveByFlag(true);
                        }
                        else if (this.isOnNextTurnButton == true) {
                            this.rno[1] = 1;
                            this.isOpenClose = true;
                            this.sound.play(gRes.seNewspaper);
                        }
                        break;
                    case 1:
                        var tmpCard = this.cards[this.rno[2]]; // cardId
                        var tmpScl = tmpCard.cardContainer.scaleX;
                        tmpScl = Math.max(tmpScl - 0.1, tmpCard.defaultScale);
                        tmpCard.cardContainer.setScale(tmpScl);
                        var rate = (tmpScl - tmpCard.defaultScale) / (1.0 - tmpCard.defaultScale);
                        var ratePos = this.getRatePos(tmpCard.defaultPos, this.cards[4].defaultPos, rate);
                        tmpCard.cardContainer.setPosition(ratePos.x, ratePos.y);
                        this.setShuffleButtonPosByRate(rate);
                        this.scoreBar.setPosByRate(1.0 - rate);
                        if (tmpScl <= tmpCard.defaultScale) {
                            if (this.isOnNextTurnButton == true) {
                                this.rno = [GameScene.RN0_SHUFFLE, 0, 0];
                                this.isOnNextTurnButton = false;
                                this.isOnShffleButton = false;
                                this.shuffleRemain = gGame.o_shuffleNum;
                                this.shuffleButton.getByName('btnTxt').setText('シャッフル:残り' + this.shuffleRemain);
                            }
                            else {
                                this.rno = [GameScene.RN0_WAIT, 0, 0];
                            }
                            this.onCardId = -1;
                            this.isOpenClose = false;
                        }
                        break;
                }
                break;
            case GameScene.RN0_SELECT_DRAW: // draw selected card and score it
                break;
        }
    }
    shuffleImmediate() {
        this.isShuffling = true;
        this.sound.play(gRes.seBook);
        console.log("length=" + this.cards.length);
        this.wordIdArr = [];
        for (var i = 0; i < this.cards.length; ++i) {
            this.shuffleOne(i, gGame.o_grade);
        }
        this.isShuffling = false;
    }
    getMaxCharByGrade(_grade) {
        var gradeLimitArr = [1006, 80, 240, 441, 640, 825, 1006]; // 0(all),1,2,3,4,5,6
        _grade = Math.min(Math.max(_grade, 1), 6);
        console.log("grade=" + _grade);
        var selMax = gradeLimitArr[_grade];
        return Math.min(selMax + 1, gWordArr.length);
    }
    shuffleOne(_cardId, _grade) {
        var str = this.selectRandomStr(1, this.getMaxCharByGrade(_grade));
        this.cards[_cardId].setString(str);
    }
    selectRandomStr(_start, _end) {
        _start = Math.max(1, Math.min(_start, gWordArr.length));
        _end = Math.max(1, Math.min(_end, gWordArr.length));
        if (_start >= _end) {
            _start = 1;
            _end = gWordArr.length;
        }
        var size = _end - _start;
        var r;
        do {
            r = Math.floor(Math.random() * size) + 1;
        } while (this.isOverlap(r));
        this.wordIdArr.push(r);
        return gWordArr[r].split(',')[0];
    }
    isOverlap(_id) {
        var ret = false;
        for (var i = 0; i < this.wordIdArr.length; ++i) {
            if (_id == this.wordIdArr[i]) {
                ret = true;
                break;
            }
        }
        return ret;
    }
    getRatePos(_sttPos, _endPos, _rate) {
        var ratePosX = (_sttPos.x + (_endPos.x - _sttPos.x) * _rate);
        var ratePosY = (_sttPos.y + (_endPos.y - _sttPos.y) * _rate);
        return new Phaser.Math.Vector2(ratePosX, ratePosY);
    }
    onCardClick(_card) {
        if (!this.isOpenClose) {
            this.onCardId = _card.cardId;
            console.log('button on[' + _card.cardId + ']');
        }
    }
    setShuffleButtonPosByRate(_rate) {
        var sx = gConfig.width * 0.5;
        var sy_stt = gConfig.height - 100;
        var sy_end = gConfig.height - 200;
        this.shuffleButton.setPosition(sx, sy_stt + (sy_end - sy_stt) * _rate);
    }
    onTouchStartFunc() {
        if (gGame.sound.context.state === 'suspended') {
            console.log("touchStart");
            gGame.sound.context.resume();
            gGame.sound.play(gRes.seMute);
        }
    }
    onShuffleClick(_button) {
        console.log("onShuffleClick");
        if (this.rno[0] == GameScene.RN0_WAIT) {
            if (this.shuffleRemain > 0) {
                this.shuffleRemain--;
                this.shuffleButton.getByName('btnTxt').setText('シャッフル:残り' + this.shuffleRemain);
                if (this.shuffleRemain <= 0) {
                    this.shuffleButton.getByName('btnImg').disableInteractive();
                }
            }
            this.isOnShffleButton = true;
        }
    }
    onHelpClick(_button) {
        var query = '?nGrade=' + gGame.o_grade + '&nShuffle=' + gGame.o_shuffleNum + '';
        var win = window.open('./help.html' + query + '&isTab=true', '_help');
        if (win == null) {
            if (window.confirm('新しいウインドウが開けませんでした。ゲームを終了して別画面へ遷移しますか？')) {
                window.location.href = './help.html' + query;
            }
            else { }
        }
    }
    onResetClick(_button) {
        if (window.confirm('ゲームを終了してタイトル画面に戻ります')) {
            var query = '?nGrade=' + gGame.o_grade + '&nShuffle=' + gGame.o_shuffleNum + '';
            window.location.href = './index.html' + query;
        }
        else { }
    }
    onNextClick(_button) {
        if (window.confirm('シャッフルして次のターンに移ります')) {
            this.isOnNextTurnButton = true;
            this.shuffleButton.getByName('btnImg').setInteractive();
            //this.shuffleImmediate();
        }
        else { }
    }
}
GameScene.RN0_INIT = 0; // prepare
GameScene.RN0_WAIT = 1; // woit for shffle or select a card
GameScene.RN0_SHUFFLE = 2; // shuffle
GameScene.RN0_SELECT_OPEN = 3; // select a card and open
GameScene.RN0_SELECT_CLOSE = 4; // select a card and close
GameScene.RN0_SELECT_DRAW = 5; // draw selected card and score it
//export default GameScene
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
};
//window.document.body.onload=p3onLoad;
var gConfig = {
    //mode: Phaser.Scale.RESIZE,
    //scaleMode:Phaser.ScaleModes.DEFAULT,
    //scale:Phaser.Scale.FIT,
    type: Phaser.AUTO,
    parent: 'iPhaser3Content',
    width: 600,
    height: 900,
    pixelArt: false,
    //antialias: false,
    //roundPixels: false,
    audio: {
        disableWebAudio: false
    },
    fps: {
        target: 10,
    },
    scene: [InitScene, GameScene, SystemScene,],
    //  The version of your game appears after the title in the banner
    title: 'MyTest',
    version: '1.0.0'
};
var gGame = null;
var gBgm = null;
var gSe = null;
var gWordArr = null;
function p3onLoad() {
    gGame = new Phaser.Game(gConfig);
    var vars = getUrlVars();
    gGame.o_shuffleNum = (!(typeof vars["nShuffle"] === "undefined")) ? vars["nShuffle"] : 3;
    gGame.o_grade = (!(typeof vars["nGrade"] === "undefined")) ? vars["nGrade"] : 6;
    gGame.o_isResized = false;
    gGame.o_resizeWindow = resizeWindow;
    gGame.o_resizeWindow();
    gGame.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
        console.log(displaySize + ":" + resolution);
        gGame.o_isResized = true;
    });
}
function resizeWindow() {
    var topContainer = window.document.getElementById('iPhaser3Content');
    var contentSize = { x: topContainer.clientWidth, y: topContainer.clientHeight };
    // _winにcanvasをfitさせるscale
    var fitScale = Math.min(contentSize.x / gConfig.width, contentSize.y / gConfig.height);
    gGame.scale.setZoom(fitScale);
    gGame.scale.updateScale(); //.resize(700,600);
}
function getUrlVars() {
    var vars = {};
    var param = location.search.substring(1).split('&');
    for (var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if (keySearch != -1)
            key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if (key != '')
            vars[key] = decodeURI(val);
    }
    return vars;
}
//> Set-ExecutionPolicy Restricted
class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene', active: false });
    }
    initialize() {
    }
    preload() {
        //this.load.setBaseURL('https://elix.jp/app/phaser/assets');
        this.load.setBaseURL('../assets'); // ./src/../assets
    }
    create() {
        this.rpgatras = this.add.image(200, 200, 'rpgatras');
        this.map = this.createMap();
        this.map.x = this.map.y = 100;
        this.map.scaleX = this.map.scaleY = 8;
        this.playerSprite = this.setTileSprite();
        this.playerSprite.setInteractive();
        this.input.setDraggable(this.playerSprite);
        gSe = this.sound.add(gRes.seClick);
        gBgm = this.sound.add(gRes.bgmBgm);
        gBgm.detune = 1600;
        gBgm.volume = 0.1;
        gBgm.setLoop(true);
        //gBgm.play();
        // drag setup
        this.input.on('dragstart', function (pointer, gameObject) {
            console.log('dragstart');
        }, this);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            console.log('drag' + dragX + "," + dragY);
            gameObject.x = dragX;
            gameObject.y = dragY;
        }, this);
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            console.log('dragend' + "," + dropped);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        });
    }
    update() {
        this.tileSprCnt = (this.tileSprCnt + 1) & 0xffff;
        this.playerSprite.tilePositionX = 32 * ((this.tileSprCnt >> 4) & 0xf);
        this.playerSprite.tilePositionY = 48 * ((this.tileSprCnt >> 8) & 0xf);
        this.map.angle += 1;
    }
    setTileSprite() {
        var tileSprite = this.add.tileSprite(100, 100, 16, 24, 'rpgatras');
        tileSprite.tilePositionX = 32 * 0;
        tileSprite.tilePositionY = 48 * 0;
        tileSprite.tileScaleX = 1;
        tileSprite.tileScaleY = 1;
        tileSprite.scaleX = 8;
        tileSprite.scaleY = 8;
        return tileSprite;
    }
    createMap() {
        var container = this.add.container(0, 0);
        for (var y = 0; y < 10; ++y) {
            for (var x = 0; x < 10; ++x) {
                var tileSprite = this.add.tileSprite((x - 4) * 8 + 4, (y - 4) * 8 + 4, 8, 8, 'rpgatras');
                tileSprite.tilePositionX = Math.floor(Math.random() * 12) * 8;
                tileSprite.tilePositionY = 64 * 3;
                container.add(tileSprite);
                tileSprite.tilePositionX = 0;
                // https://phaser.io/examples/v3/view/input/multitouch/multi-touch-test
                tileSprite.setInteractive();
                tileSprite.on('pointerdown', function () {
                    this.tilePositionX = Math.floor(Math.random() * 12) * 8;
                    gSe.play();
                });
            }
        }
        return container;
    }
}
//export default GameScene
class ScoreBar {
    constructor(_myScene, _posX, _posY) {
        var cw = 580, ch = 40, rr = 30;
        this.myScene = _myScene;
        this.container = _myScene.add.container(0, 0);
        this.score = 0;
        this.defaultPos = new Phaser.Math.Vector2(_posX, _posY);
        var graph = this.myScene.make.graphics({ x: 0, y: 0, add: false });
        graph.fillStyle(0xccffff, 1);
        graph.fillCircle(rr, rr, rr);
        graph.lineStyle(4, 0x444444, 0.5);
        graph.strokeCircle(rr, rr, rr - 2);
        var circleTex;
        circleTex = graph.generateTexture('graphicsCircle', rr * 2, rr * 2);
        this.circleImage = _myScene.add.image(0, 0, 'graphicsCircle');
        this.container.add(this.circleImage);
        this.scoreText = this.myScene.add.text(0, 0, this.score.toString());
        this.scoreText.setStyle({
            fill: '#eeeeee',
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            stroke: '#c0c0c0',
            strokeThickness: 1,
        });
        this.scoreText.setOrigin(0.5);
        this.scoreText.setAlign('center');
        this.scoreText.setTint(0x0000cc, 0x4444ff, 0x0000cc, 0x4444ff);
        this.container.add(this.scoreText);
        this.myScene.sound.add(gRes.sePointUp);
        this.myScene.sound.add(gRes.sePointDoun);
        this.plusButton = createCustomButton(this.myScene, 80, 0, 60, 50, 5, "+", "", 48);
        this.plusButton.getByName("btnImg").setInteractive().on('pointerdown', function () {
            //console.log("plusButton");
            if (this.score < 998) {
                this.score = Math.min(999, this.score + 1);
                this.scoreText.setText(this.score.toString());
                this.myScene.sound.play(gRes.sePointUp);
            }
        }.bind(this));
        this.container.add(this.plusButton);
        this.minusButton = createCustomButton(this.myScene, -80, 0, 60, 50, 5, "-", "", 48);
        this.minusButton.getByName("btnImg").setInteractive().on('pointerdown', function () {
            //console.log("minusButton");
            if (this.score > 0) {
                this.score = Math.max(0, this.score - 1);
                this.scoreText.setText(this.score.toString());
                this.myScene.sound.play(gRes.sePointDoun);
            }
        }.bind(this));
        this.container.add(this.minusButton);
        this.container.setPosition(this.defaultPos.x, this.defaultPos.y);
    }
    setPosByRate(_rate) {
        var rateY = this.defaultPos.y + (-60 - this.defaultPos.y) * _rate;
        this.container.setPosition(this.defaultPos.x, rateY);
    }
    setInteractiveByFlag(_isset) {
        if (_isset == true) {
            this.plusButton.getByName("btnImg").setInteractive();
            this.minusButton.getByName("btnImg").setInteractive();
            console.debug("btnIntOn");
        }
        else {
            this.plusButton.getByName("btnImg").disableInteractive();
            this.minusButton.getByName("btnImg").disableInteractive();
            console.debug("btnIntOff");
        }
    }
}
//-------------------------------------------------
class WordCard {
    constructor(_myScene, _cardSprTexStr = 'graphicsCardSpr') {
        this.letters = [];
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
    createCard(_id, _x, _y, _scale, _string, _clickFunc = '') {
        this.cardId = _id;
        var con = this.myScene.add.container(0, 0);
        this.cardContainer = con;
        this.cardImage = this.myScene.add.image(0, 0, this.cardSprTexStr);
        this.cardContainer.add(this.cardImage);
        this.letters = [];
        this.defaultScale = _scale;
        this.defaultPos = new Phaser.Math.Vector2(_x, _y);
        this.setString(_string);
        con.x = _x;
        con.y = _y;
        con.setScale(_scale);
        if (_clickFunc != '') {
            this.cardImage.setInteractive();
            this.cardImage.on('pointerdown', function () {
                eval('this.myScene.' + _clickFunc + '(this)');
            }.bind(this));
        }
        return con;
    }
    setString(_string) {
        this.removeString();
        var ch = 640;
        var slen = _string.length;
        var fsz = Math.floor(ch / (Math.max(2.5, slen) * 1.2)); // 1文字の時は1/1.5
        for (var i = 0; i < slen; ++i) {
            var cardText = this.myScene.add.text(-0.5 * fsz, (i * 2 - slen) * 0.5 * fsz, _string[i]);
            cardText.setStyle({
                fill: '#eeeeee',
                fontFamily: 'Arial',
                fontSize: fsz,
                fontWeight: 'bold',
                stroke: '#c0c0c0',
                strokeThickness: 4,
                align: 'center',
            });
            cardText.setTint(0x0000cc, 0x4444ff, 0x0000cc, 0x4444ff);
            if (_string[i] == 'ー' || _string[i] == '…') {
                cardText.angle = 90;
                cardText.x += fsz;
            }
            this.cardContainer.add(cardText);
            this.letters.push(cardText);
        }
        //console.log("letters="+this.letters.length);
    }
    removeString() {
        for (var i = 0; i < this.letters.length; ++i) {
            this.letters[i].destroy();
        }
        this.letters = [];
    }
}
//# sourceMappingURL=main.js.map