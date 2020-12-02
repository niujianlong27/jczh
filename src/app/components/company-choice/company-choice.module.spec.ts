import { CompanyChoiceModule } from './company-choice.module';

describe('CompanyChoiceModule', () => {
  let companyChoiceModule: CompanyChoiceModule;

  beforeEach(() => {
    companyChoiceModule = new CompanyChoiceModule();
  });

  it('should create an instance', () => {
    expect(companyChoiceModule).toBeTruthy();
  });
});
