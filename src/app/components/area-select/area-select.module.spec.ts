import { AreaSelectModule } from './area-select.module';

describe('AreaSelectModule', () => {
  let areaSelectModule: AreaSelectModule;

  beforeEach(() => {
    areaSelectModule = new AreaSelectModule();
  });

  it('should create an instance', () => {
    expect(areaSelectModule).toBeTruthy();
  });
});
