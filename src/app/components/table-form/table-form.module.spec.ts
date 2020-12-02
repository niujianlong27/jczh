import { TableFormModule } from './table-form.module';

describe('TableFormModule', () => {
  let tableFormModule: TableFormModule;

  beforeEach(() => {
    tableFormModule = new TableFormModule();
  });

  it('should create an instance', () => {
    expect(tableFormModule).toBeTruthy();
  });
});
