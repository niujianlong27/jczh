import { XlsxModule } from './xlsx.module';

describe('XlsxModule', () => {
  let xlsxModule: XlsxModule;

  beforeEach(() => {
    xlsxModule = new XlsxModule();
  });

  it('should create an instance', () => {
    expect(xlsxModule).toBeTruthy();
  });
});
