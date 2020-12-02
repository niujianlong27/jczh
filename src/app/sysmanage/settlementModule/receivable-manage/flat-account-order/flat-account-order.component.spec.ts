import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAccountOrderComponent } from './flat-account-order.component';

describe('FlatAccountOrderComponent', () => {
  let component: FlatAccountOrderComponent;
  let fixture: ComponentFixture<FlatAccountOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatAccountOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatAccountOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
