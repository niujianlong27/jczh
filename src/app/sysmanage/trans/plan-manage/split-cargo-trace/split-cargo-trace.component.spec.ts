import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitCargoTraceComponent } from './split-cargo-trace.component';

describe('SplitCargoTraceComponent', () => {
  let component: SplitCargoTraceComponent;
  let fixture: ComponentFixture<SplitCargoTraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitCargoTraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitCargoTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
