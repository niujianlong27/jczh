import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInPlannedRegistrationComponent } from './stock-in-planned-registration.component';

describe('StockInPlannedRegistrationComponent', () => {
  let component: StockInPlannedRegistrationComponent;
  let fixture: ComponentFixture<StockInPlannedRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInPlannedRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInPlannedRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
