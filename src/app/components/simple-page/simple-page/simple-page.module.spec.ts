import { SimplePageModule } from './simple-page.module';

describe('SimplePageModule', () => {
  let simplePageModule: SimplePageModule;

  beforeEach(() => {
    simplePageModule = new SimplePageModule();
  });

  it('should create an instance', () => {
    expect(simplePageModule).toBeTruthy();
  });
});
