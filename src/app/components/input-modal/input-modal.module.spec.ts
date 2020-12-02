import { InputModalModule } from './input-modal.module';

describe('InputModalModule', () => {
  let inputModalModule: InputModalModule;

  beforeEach(() => {
    inputModalModule = new InputModalModule();
  });

  it('should create an instance', () => {
    expect(inputModalModule).toBeTruthy();
  });
});
