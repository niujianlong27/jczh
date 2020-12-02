import { ReceivableManageModule } from './receivable-manage.module';

describe('ReceivableManageModule', () => {
  let receivableManageModule: ReceivableManageModule;

  beforeEach(() => {
    receivableManageModule = new ReceivableManageModule();
  });

  it('should create an instance', () => {
    expect(receivableManageModule).toBeTruthy();
  });
});
