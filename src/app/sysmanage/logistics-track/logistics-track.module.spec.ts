import { LogisticsTrackModule } from './logistics-track.module';

describe('LogisticsTrackModule', () => {
  let logisticsTrackModule: LogisticsTrackModule;

  beforeEach(() => {
    logisticsTrackModule = new LogisticsTrackModule();
  });

  it('should create an instance', () => {
    expect(logisticsTrackModule).toBeTruthy();
  });
});
