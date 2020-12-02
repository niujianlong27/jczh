import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableForm2Component } from './table-form2.component';

describe('TableFormComponent', () => {
  let component: TableForm2Component;
  let fixture: ComponentFixture<TableForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableForm2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
