import { EntrustManageModule } from './entrust-manage.module';

describe('EntrustManageModule', () => {
  let entrustManageModule: EntrustManageModule;

  beforeEach(() => {
    entrustManageModule = new EntrustManageModule();
  });

  it('should create an instance', () => {
    expect(entrustManageModule).toBeTruthy();
  });
});
