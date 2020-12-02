import { AccountInformationModule } from './account-information.module';

describe('AccountInformationModule', () => {
  let accountInformationModule: AccountInformationModule;

  beforeEach(() => {
    accountInformationModule = new AccountInformationModule();
  });

  it('should create an instance', () => {
    expect(accountInformationModule).toBeTruthy();
  });
});
