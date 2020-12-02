import { SysPermissionModule } from './sys-permission.module';

describe('SysPermissionModule', () => {
  let sysPermissionModule: SysPermissionModule;

  beforeEach(() => {
    sysPermissionModule = new SysPermissionModule();
  });

  it('should create an instance', () => {
    expect(sysPermissionModule).toBeTruthy();
  });
});
