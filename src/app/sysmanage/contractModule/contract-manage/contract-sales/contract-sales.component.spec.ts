import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSalesComponent } from './contract-sales.component';

describe('ContractSalesComponent', () => {
  let component: ContractSalesComponent;
  let fixture: ComponentFixture<ContractSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
