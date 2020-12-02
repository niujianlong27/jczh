import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighingRecordComponent } from './weighing-record.component';

describe('WeighingRecordComponent', () => {
  let component: WeighingRecordComponent;
  let fixture: ComponentFixture<WeighingRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighingRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
