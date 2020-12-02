import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDeliverComponent } from './day-deliver.component';

describe('DayDeliverComponent', () => {
  let component: DayDeliverComponent;
  let fixture: ComponentFixture<DayDeliverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayDeliverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayDeliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
