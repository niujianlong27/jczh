import { EntryQueueModule } from './entryqueue.module';

describe('EntryQueueModule', () => {
  let testModule: EntryQueueModule;

  beforeEach(() => {
    testModule = new EntryQueueModule();
  });

  it('should create an instance', () => {
    expect(testModule).toBeTruthy();
  });
});
