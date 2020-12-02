import { SeaModule } from './sea.module';

describe('SeaModule', () => {
  let seaModule: SeaModule;

  beforeEach(() => {
    seaModule = new SeaModule();
  });

  it('should create an instance', () => {
    expect(seaModule).toBeTruthy();
  });
});
