const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#1b1e2b',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [MenuScene, TutorialScene, GameScene, GameOverScene]
};

const PIPELINE_STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];

const game = new Phaser.Game(config);
