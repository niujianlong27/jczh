import { TransModule } from './trans.module';

describe('TransModule', () => {
  let transModule: TransModule;

  beforeEach(() => {
    transModule = new TransModule();
  });

  it('should create an instance', () => {
    expect(transModule).toBeTruthy();
  });
});
