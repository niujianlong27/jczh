import { TableForm2Module } from './table-form2.module';

describe('TableFormModule', () => {
  let tableFormModule: TableForm2Module;

  beforeEach(() => {
    tableFormModule = new TableForm2Module();
  });

  it('should create an instance', () => {
    expect(TableForm2Module).toBeTruthy();
  });
});
