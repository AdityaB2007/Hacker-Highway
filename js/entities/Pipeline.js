class Pipeline {
  constructor() {
    this.stages = PIPELINE_STAGES.map(() => null);
  }

  tick(hazardDetector) {
    // TODO: advance instructions, insert bubbles on stall
  }

  fetch(instruction) {
    // TODO: insert into IF stage if free
  }
}
