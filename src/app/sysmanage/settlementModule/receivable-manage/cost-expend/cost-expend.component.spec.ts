import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostExpendComponent } from './cost-expend.component';

describe('CostExpendComponent', () => {
  let component: CostExpendComponent;
  let fixture: ComponentFixture<CostExpendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostExpendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostExpendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
