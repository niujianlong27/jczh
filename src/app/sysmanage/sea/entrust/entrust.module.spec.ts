import { EntrustModule } from './entrust.module';

describe('EntrustModule', () => {
  let entrustModule: EntrustModule;

  beforeEach(() => {
    entrustModule = new EntrustModule();
  });

  it('should create an instance', () => {
    expect(entrustModule).toBeTruthy();
  });
});
