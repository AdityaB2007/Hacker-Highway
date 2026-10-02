class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  preload() {}
  create() {
    this.add.text(GAME_WIDTH / 2, 120, 'HACKER HIGHWAY', {
      fontSize: '48px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 180, 'Keep the pipeline moving. Resolve the hazards.', {
      fontSize: '18px', color: '#aab2c8'
    }).setOrigin(0.5);

    const startText = this.add.text(GAME_WIDTH / 2, 320, '[ Click to Start ]', {
      fontSize: '24px', color: '#7cf7c4'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => this.scene.start('TutorialScene'));
  }
}
