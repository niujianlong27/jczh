import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutPlannedRegistrationComponent } from './stock-out-planned-registration.component';

describe('StockOutPlannedRegistrationComponent', () => {
  let component: StockOutPlannedRegistrationComponent;
  let fixture: ComponentFixture<StockOutPlannedRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOutPlannedRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutPlannedRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
