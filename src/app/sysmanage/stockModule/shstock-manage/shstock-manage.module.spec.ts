import {ShstockManageModule} from "./shstock-manage.module";

describe('ShstockManageModule', () => {
  let shstockManageModule: ShstockManageModule;

  beforeEach(() => {
    shstockManageModule = new ShstockManageModule();
  });

  it('should create an instance', () => {
    expect(shstockManageModule).toBeTruthy();
  });
});
