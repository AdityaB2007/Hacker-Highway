class Instruction {
  constructor(id, opcode, destReg, srcRegs = []) {
    this.id = id;
    this.opcode = opcode;
    this.destReg = destReg;
    this.srcRegs = srcRegs;
    this.currentStage = 0;
    this.stalled = false;
    this.sprite = null;
  }

  advanceStage() {
    // TODO: advance to next pipeline stage
  }
}
