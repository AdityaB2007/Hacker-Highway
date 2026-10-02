class HazardDetector {
  static detectHazards(pipelineStages) {
    // TODO: detect RAW hazards between pipeline stages
    return [];
  }

  static canForward(producerStage, consumerStage) {
    // TODO: determine forwarding vs stall
    return false;
  }
}
