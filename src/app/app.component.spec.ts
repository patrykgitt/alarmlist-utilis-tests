import { Human } from './test2';
describe('Testing tests', () => {
  var calc = new Human(18);
  it('should succeed', () => expect(calc.age2()).toEqual(18));

  it('should succeed', () => expect(true).toEqual(true));
  it('should fail', () => expect(true).toEqual(false));
});
