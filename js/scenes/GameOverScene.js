class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  init(data) { this.finalScore = data.score || 0; }
  create() {
    this.add.text(GAME_WIDTH / 2, 160, 'Run Complete', {
      fontSize: '36px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 220, `Score: ${this.finalScore}`, {
      fontSize: '24px', color: '#7cf7c4'
    }).setOrigin(0.5);

    const replayText = this.add.text(GAME_WIDTH / 2, 320, '[ Play Again ]', {
      fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    replayText.on('pointerdown', () => this.scene.start('GameScene'));

    const menuText = this.add.text(GAME_WIDTH / 2, 370, '[ Back to Menu ]', {
      fontSize: '18px', color: '#aab2c8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menuText.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
