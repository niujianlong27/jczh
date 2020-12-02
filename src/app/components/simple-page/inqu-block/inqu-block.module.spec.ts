import { InquBlockModule } from './inqu-block.module';

describe('InquBlockModule', () => {
  let inquBlockModule: InquBlockModule;

  beforeEach(() => {
    inquBlockModule = new InquBlockModule();
  });

  it('should create an instance', () => {
    expect(inquBlockModule).toBeTruthy();
  });
});
