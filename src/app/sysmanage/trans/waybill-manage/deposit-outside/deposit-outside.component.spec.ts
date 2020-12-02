import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOutsideComponent } from './deposit-outside.component';

describe('DepositOutsideComponent', () => {
  let component: DepositOutsideComponent;
  let fixture: ComponentFixture<DepositOutsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositOutsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
