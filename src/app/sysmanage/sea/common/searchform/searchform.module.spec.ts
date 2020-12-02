import { SearchformModule } from './searchform.module';

describe('SearchformModule', () => {
  let searchformModule: SearchformModule;

  beforeEach(() => {
    searchformModule = new SearchformModule();
  });

  it('should create an instance', () => {
    expect(searchformModule).toBeTruthy();
  });
});
