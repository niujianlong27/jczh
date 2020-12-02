import { Searchform2Module } from './searchform2.module';

describe('Searchform2Module', () => {
  let searchformModule: Searchform2Module;

  beforeEach(() => {
    searchformModule = new Searchform2Module();
  });

  it('should create an instance', () => {
    expect(searchformModule).toBeTruthy();
  });
});
