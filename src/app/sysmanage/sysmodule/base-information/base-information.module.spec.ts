import { BaseInformationModule } from './base-information.module';

describe('BaseInformationModule', () => {
  let baseInformationModule: BaseInformationModule;

  beforeEach(() => {
    baseInformationModule = new BaseInformationModule();
  });

  it('should create an instance', () => {
    expect(baseInformationModule).toBeTruthy();
  });
});
