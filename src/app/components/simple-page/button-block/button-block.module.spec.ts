import { ButtonBlockModule } from './button-block.module';

describe('ButtonBlockModule', () => {
  let buttonBlockModule: ButtonBlockModule;

  beforeEach(() => {
    buttonBlockModule = new ButtonBlockModule();
  });

  it('should create an instance', () => {
    expect(buttonBlockModule).toBeTruthy();
  });
});
