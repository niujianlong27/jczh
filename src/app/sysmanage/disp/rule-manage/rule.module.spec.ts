import { RuleModule } from './rule.module';

describe('RuleModule', () => {
  let testModule: RuleModule;

  beforeEach(() => {
    testModule = new RuleModule();
  });

  it('should create an instance', () => {
    expect(testModule).toBeTruthy();
  });
});
