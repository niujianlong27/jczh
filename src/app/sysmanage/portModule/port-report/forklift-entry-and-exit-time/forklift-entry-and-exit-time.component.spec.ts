import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftEntryAndExitTimeComponent } from './forklift-entry-and-exit-time.component';

describe('ForkliftEntryAndExitTimeComponent', () => {
  let component: ForkliftEntryAndExitTimeComponent;
  let fixture: ComponentFixture<ForkliftEntryAndExitTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForkliftEntryAndExitTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkliftEntryAndExitTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
