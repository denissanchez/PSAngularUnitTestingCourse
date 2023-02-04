describe("First test", () => {
  let sut: {[key: string]: any};


  beforeEach(() => {
    sut = {};
  })


  it('should be true if true', () => {
    // arrange
    sut.a = false;

    // act
    sut.a = true;

    // assert
    expect(sut.a).toBe(true)
  })

  it('should less than 10', () => {
    sut.number = 5;

    sut.number = 8;

    expect(sut.number).toBeLessThan(10);
  })
});
