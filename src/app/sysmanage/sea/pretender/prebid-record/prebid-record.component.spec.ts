import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebidRecordComponent } from './prebid-record.component';

describe('PrebidRecordComponent', () => {
  let component: PrebidRecordComponent;
  let fixture: ComponentFixture<PrebidRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebidRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebidRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
