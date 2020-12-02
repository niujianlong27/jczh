import { WaybillModule } from './waybill.module';

describe('WaybillModule', () => {
  let waybillModule: WaybillModule;

  beforeEach(() => {
    waybillModule = new WaybillModule();
  });

  it('should create an instance', () => {
    expect(waybillModule).toBeTruthy();
  });
});
