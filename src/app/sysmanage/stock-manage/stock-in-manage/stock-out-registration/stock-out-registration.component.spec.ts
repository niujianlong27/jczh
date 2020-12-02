import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutRegistrationComponent } from './stock-out-registration.component';

describe('StockOutRegistrationComponent', () => {
  let component: StockOutRegistrationComponent;
  let fixture: ComponentFixture<StockOutRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOutRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
