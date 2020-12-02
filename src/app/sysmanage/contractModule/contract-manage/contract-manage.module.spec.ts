import { ContractManageModule } from './contract-manage.module';

describe('ContractManageModule', () => {
  let contractManageModule: ContractManageModule;

  beforeEach(() => {
    contractManageModule = new ContractManageModule();
  });

  it('should create an instance', () => {
    expect(contractManageModule).toBeTruthy();
  });
});
