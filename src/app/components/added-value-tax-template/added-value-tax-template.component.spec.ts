import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedValueTaxTemplateComponent } from './added-value-tax-template.component';

describe('AddedValueTaxTemplateComponent', () => {
  let component: AddedValueTaxTemplateComponent;
  let fixture: ComponentFixture<AddedValueTaxTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedValueTaxTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedValueTaxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
