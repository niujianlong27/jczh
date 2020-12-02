import { MutiSearchModule } from './muti-search.module';

describe('MutiSearchModule', () => {
  let mutiSearchModule: MutiSearchModule;

  beforeEach(() => {
    mutiSearchModule = new MutiSearchModule();
  });

  it('should create an instance', () => {
    expect(mutiSearchModule).toBeTruthy();
  });
});
