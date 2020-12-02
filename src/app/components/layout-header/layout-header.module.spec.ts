import { LayoutHeaderModule } from './layout-header.module';

describe('LayoutHeaderModule', () => {
  let layoutHeaderModule: LayoutHeaderModule;

  beforeEach(() => {
    layoutHeaderModule = new LayoutHeaderModule();
  });

  it('should create an instance', () => {
    expect(layoutHeaderModule).toBeTruthy();
  });
});
