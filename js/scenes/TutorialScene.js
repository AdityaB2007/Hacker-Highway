class TutorialScene extends Phaser.Scene {
  constructor() { super('TutorialScene'); }
  preload() {}
  create() {
    this.add.text(GAME_WIDTH / 2, 40, 'Tutorial', {
      fontSize: '32px', color: '#ffffff'
    }).setOrigin(0.5);

    const skipText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '[ Skip to Game ]', {
      fontSize: '20px', color: '#7cf7c4'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    skipText.on('pointerdown', () => this.scene.start('GameScene'));
  }
}
