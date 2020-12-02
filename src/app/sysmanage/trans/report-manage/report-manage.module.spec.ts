import { ReportManageModule } from './report-manage.module';

describe('ReportManageModule', () => {
  let reportManageModule: ReportManageModule;

  beforeEach(() => {
    reportManageModule = new ReportManageModule();
  });

  it('should create an instance', () => {
    expect(reportManageModule).toBeTruthy();
  });
});
