import { PretenderModule } from './pretender.module';

describe('PretenderModule', () => {
  let pretenderModule: PretenderModule;

  beforeEach(() => {
    pretenderModule = new PretenderModule();
  });

  it('should create an instance', () => {
    expect(pretenderModule).toBeTruthy();
  });
});
