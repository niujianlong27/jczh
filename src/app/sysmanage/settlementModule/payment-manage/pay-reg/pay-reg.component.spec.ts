import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRegComponent } from './pay-reg.component';

describe('PayRegComponent', () => {
  let component: PayRegComponent;
  let fixture: ComponentFixture<PayRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
