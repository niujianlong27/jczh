import { TplButtonsModule } from './tpl-buttons.module';

describe('TplButtonsModule', () => {
  let tplButtonsModule: TplButtonsModule;

  beforeEach(() => {
    tplButtonsModule = new TplButtonsModule();
  });

  it('should create an instance', () => {
    expect(tplButtonsModule).toBeTruthy();
  });
});
