import { MutiColModule } from './muti-col.module';

describe('MutiColModule', () => {
  let mutiColModule: MutiColModule;

  beforeEach(() => {
    mutiColModule = new MutiColModule();
  });

  it('should create an instance', () => {
    expect(mutiColModule).toBeTruthy();
  });
});
