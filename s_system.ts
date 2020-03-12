class SystemScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SystemScene', active: true });
  }
  initialize ()
  {
  }
  preload(){
  }

  create ()
  {
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

  update ()
  {
    if(gGame.o_isResized){
      gGame.o_resizeWindow();
      gGame.o_isResized = false;
    }
  }
}
//export default SystemScene

