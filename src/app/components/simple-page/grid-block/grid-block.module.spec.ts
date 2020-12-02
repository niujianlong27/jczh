import { GridBlockModule } from './grid-block.module';

describe('GridBlockModule', () => {
  let gridBlockModule: GridBlockModule;

  beforeEach(() => {
    gridBlockModule = new GridBlockModule();
  });

  it('should create an instance', () => {
    expect(gridBlockModule).toBeTruthy();
  });
});
