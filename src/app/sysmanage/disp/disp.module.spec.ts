import { DispModule } from './disp.module';

describe('DispModule', () => {
  let dispModule: DispModule;

  beforeEach(() => {
    dispModule = new DispModule();
  });

  it('should create an instance', () => {
    expect(dispModule).toBeTruthy();
  });
});
