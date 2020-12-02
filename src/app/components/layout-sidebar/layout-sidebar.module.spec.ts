import { LayoutSidebarModule } from './layout-sidebar.module';

describe('LayoutSidebarModule', () => {
  let layoutSidebarModule: LayoutSidebarModule;

  beforeEach(() => {
    layoutSidebarModule = new LayoutSidebarModule();
  });

  it('should create an instance', () => {
    expect(layoutSidebarModule).toBeTruthy();
  });
});
