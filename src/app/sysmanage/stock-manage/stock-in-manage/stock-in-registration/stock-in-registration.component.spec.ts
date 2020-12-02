import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInRegistrationComponent } from './stock-in-registration.component';

describe('StockInRegistrationComponent', () => {
  let component: StockInRegistrationComponent;
  let fixture: ComponentFixture<StockInRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
