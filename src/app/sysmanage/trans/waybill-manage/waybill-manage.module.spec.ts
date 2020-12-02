import { WaybillManageModule } from './waybill-manage.module';

describe('WaybillManageModule', () => {
  let waybillManageModule: WaybillManageModule;

  beforeEach(() => {
    waybillManageModule = new WaybillManageModule();
  });

  it('should create an instance', () => {
    expect(waybillManageModule).toBeTruthy();
  });
});
