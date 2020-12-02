import { ReportDesignModule } from './report-design.module';

describe('ReportDesignModule', () => {
  let reportDesignModule: ReportDesignModule;

  beforeEach(() => {
    reportDesignModule = new ReportDesignModule();
  });

  it('should create an instance', () => {
    expect(reportDesignModule).toBeTruthy();
  });
});
