import { PaymentManageModule } from './payment-manage.module';

describe('PaymentManageModule', () => {
  let paymentManageModule: PaymentManageModule;

  beforeEach(() => {
    paymentManageModule = new PaymentManageModule();
  });

  it('should create an instance', () => {
    expect(paymentManageModule).toBeTruthy();
  });
});
