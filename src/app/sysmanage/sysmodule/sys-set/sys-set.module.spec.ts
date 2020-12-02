import { SysSetModule } from './sys-set.module';

describe('SysSetModule', () => {
  let sysSetModule: SysSetModule;

  beforeEach(() => {
    sysSetModule = new SysSetModule();
  });

  it('should create an instance', () => {
    expect(sysSetModule).toBeTruthy();
  });
});
