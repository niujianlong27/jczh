import { StockManageModule } from './stock-manage.module';

describe('StockManageModule', () => {
  let stockManageModule: StockManageModule;

  beforeEach(() => {
    stockManageModule = new StockManageModule();
  });

  it('should create an instance', () => {
    expect(stockManageModule).toBeTruthy();
  });
});
