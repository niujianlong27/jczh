import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostLncomeComponent } from './cost-lncome.component';

describe('CostLncomeComponent', () => {
  let component: CostLncomeComponent;
  let fixture: ComponentFixture<CostLncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostLncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostLncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
