import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusiSegmentComponent } from './busi-segment.component';

describe('BusiSegmentComponent', () => {
  let component: BusiSegmentComponent;
  let fixture: ComponentFixture<BusiSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusiSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusiSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
