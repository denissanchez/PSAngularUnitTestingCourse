import { StrengthPipe } from './strength.pipe';


describe("Strength Pipe", () => {
  let pipe: StrengthPipe;

  beforeEach(() => {
    pipe = new StrengthPipe();
  });

  it("Should display weak if strength is 5", () => {
    const value = pipe.transform(5);

    expect(value).toEqual('5 (weak)');
  })

  it('should display strong if strength is 10', () => {
    const value = pipe.transform(10);

    expect(value).toEqual('10 (strong)');
  })

  it('should display unbelievable if strength is greater than 20', () => {
    const value = pipe.transform(21);

    expect(value).toEqual('21 (unbelievable)');
  })
});
