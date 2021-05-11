//import { Human } from './test2';
///describe('Testing tests', () => {
//  var calc = new Human(18);
//  it('should succeed', () => expect(calc.age2()).toEqual(18));
//
//  it('should succeed', () => expect(true).toEqual(true));
//  it('should fail', () => expect(true).toEqual(false));
//});
import { PlcCommMgnt } from './commMgnt';
describe('Testing tests', () => {
  var commMgnt = new PlcCommMgnt();
  var testRegs = [
  {
    device: "R0",
    type: "int"
  },
  {
    device: "R1",
    type: "int"
  },
  {
    device: "R2",
    type: "int"
  },
  {
    device: "R3",
    type: "int"
  },
  {
    device: "R4",
    type: "int"
  },
  {
    device: "R5",
    type: "int"
  }];
  commMgnt.stringsRegs(0,6,1);
  it('should return array of regs', () => expect(commMgnt.getPlcRegs()).toEqual(testRegs));

  //it('should succeed', () => expect(true).toEqual(true));
  //it('should fail', () => expect(true).toEqual(false));
});
