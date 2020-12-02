import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPriceComponent } from './check-price.component';

describe('CheckPriceComponent', () => {
  let component: CheckPriceComponent;
  let fixture: ComponentFixture<CheckPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
