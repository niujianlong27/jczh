import { SysmanageModule } from './sysmanage.module';

describe('SysmanageModule', () => {
  let sysmanageModule: SysmanageModule;

  beforeEach(() => {
    sysmanageModule = new SysmanageModule();
  });

  it('should create an instance', () => {
    expect(sysmanageModule).toBeTruthy();
  });
});
