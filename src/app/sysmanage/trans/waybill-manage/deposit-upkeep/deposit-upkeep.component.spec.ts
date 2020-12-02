import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositUpkeepComponent } from './deposit-upkeep.component';

describe('DepositUpkeepComponent', () => {
  let component: DepositUpkeepComponent;
  let fixture: ComponentFixture<DepositUpkeepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositUpkeepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositUpkeepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
