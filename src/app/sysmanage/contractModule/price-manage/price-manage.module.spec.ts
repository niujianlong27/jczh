import { PriceManageModule } from './price-manage.module';

describe('PriceManageModule', () => {
  let priceManageModule: PriceManageModule;

  beforeEach(() => {
    priceManageModule = new PriceManageModule();
  });

  it('should create an instance', () => {
    expect(priceManageModule).toBeTruthy();
  });
});
