class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  preload() {}
  create() {
    this.pipeline = new Pipeline();
    this.generator = new InstructionGenerator(0.3);
    this.score = 0;
    this.activeInstructions = [];

    this.drawLanes();
    this.drawHUD();
  }

  drawLanes() {
    PIPELINE_STAGES.forEach((stage, i) => {
      this.add.text(100 + i * 160, 20, stage, { fontSize: '16px', color: '#7cf7c4' });
    });
  }

  drawHUD() {
    this.scoreText = this.add.text(20, GAME_HEIGHT - 30, 'Score: 0', {
      fontSize: '18px', color: '#ffffff'
    });
  }

  update(time, delta) {
    // TODO: main game loop
  }

  endGame() {
    this.scene.start('GameOverScene', { score: this.score });
  }
}
