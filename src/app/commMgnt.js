export class PlcCommMgnt {
  plcRegs = [];
  maxRegPerReq = 32;
  startReg = 0;
  noOfRegsPerString = 16;
  noOfStrings = 16;
  constructor() {
    this.stringsRegs(this.startReg, this.noOfRegsPerString, this.noOfStrings);
  }
  stringsRegs(startReg, noOfRegsPerSting, noOfStrings) {
    let noOfRegs = noOfRegsPerSting * noOfStrings;
    for (let i = 0; i < noOfRegs; i++) {
      let temp='R'+i.toString();
      this.plcRegs.push({ device: temp, type: 'int' });
      
    }
    console.log(this.plcRegs);
  }
  getPlcRegs() {
    return this.plcRegs;
  }
}
