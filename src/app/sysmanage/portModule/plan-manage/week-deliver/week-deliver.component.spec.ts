import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDeliverComponent } from './week-deliver.component';

describe('WeekDeliverComponent', () => {
  let component: WeekDeliverComponent;
  let fixture: ComponentFixture<WeekDeliverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekDeliverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDeliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
