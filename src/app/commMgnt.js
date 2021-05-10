export class PlcCommMngr {
  constructor() {
    const maxRegPerReq = 32;
    const startReg = o;
    const noOfRegsPerString = 16;
    const noOfStrings = 16;
    var plcRegs;
    stringsRegs(startReg,noOfRegsPerString,noOfStrings)
  }
  stringsRegs(startReg, noOfRegsPerSting, noOfStrings) {
    noOfRegs = noOfRegsPerSting * noOfStrings;
    for (let i = 0; i < noOfRegs; i++) {
      this.plcRegs.append({device:"test";type:"int"});
    }
  }
}
