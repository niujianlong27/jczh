import { OrderManageModule } from './order-manage.module';

describe('OrderManageModule', () => {
  let orderManageModule: OrderManageModule;

  beforeEach(() => {
    orderManageModule = new OrderManageModule();
  });

  it('should create an instance', () => {
    expect(orderManageModule).toBeTruthy();
  });
});
