import { PretenderManageModule } from './pretender-manage.module';

describe('PretenderManageModule', () => {
  let pretenderManageModule: PretenderManageModule;

  beforeEach(() => {
    pretenderManageModule = new PretenderManageModule();
  });

  it('should create an instance', () => {
    expect(pretenderManageModule).toBeTruthy();
  });
});
