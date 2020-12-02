import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCarrierComponent } from './owner-carrier.component';

describe('OwnerCarrierComponent', () => {
  let component: OwnerCarrierComponent;
  let fixture: ComponentFixture<OwnerCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
