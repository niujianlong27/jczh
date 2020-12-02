import { PortOperateModule } from './port-operate.module';

describe('PortOperateModule', () => {
  let portOperateModule: PortOperateModule;

  beforeEach(() => {
    portOperateModule = new PortOperateModule();
  });

  it('should create an instance', () => {
    expect(portOperateModule).toBeTruthy();
  });
});
