import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettleComponent } from './company-settle.component';

describe('CompanySettleComponent', () => {
  let component: CompanySettleComponent;
  let fixture: ComponentFixture<CompanySettleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySettleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySettleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
