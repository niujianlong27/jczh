import { CommonPageModule } from './common-page.module';

describe('CommonPageModule', () => {
  let commonPageModule: CommonPageModule;

  beforeEach(() => {
    commonPageModule = new CommonPageModule();
  });

  it('should create an instance', () => {
    expect(commonPageModule).toBeTruthy();
  });
});
