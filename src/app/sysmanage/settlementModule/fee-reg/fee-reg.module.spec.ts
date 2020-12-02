import { FeeRegModule } from './fee-reg.module';

describe('FeeRegModule', () => {
  let feeRegModule: FeeRegModule;

  beforeEach(() => {
    feeRegModule = new FeeRegModule();
  });

  it('should create an instance', () => {
    expect(feeRegModule).toBeTruthy();
  });
});
