import { PlanManageModule } from './plan-manage.module';

describe('PlanManageModule', () => {
  let planManageModule: PlanManageModule;

  beforeEach(() => {
    planManageModule = new PlanManageModule();
  });

  it('should create an instance', () => {
    expect(planManageModule).toBeTruthy();
  });
});
