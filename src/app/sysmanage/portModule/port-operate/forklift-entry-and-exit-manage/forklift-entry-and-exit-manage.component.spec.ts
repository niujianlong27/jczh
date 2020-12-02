import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftEntryAndExitManageComponent } from './forklift-entry-and-exit-manage.component';

describe('ForkliftEntryAndExitManageComponent', () => {
  let component: ForkliftEntryAndExitManageComponent;
  let fixture: ComponentFixture<ForkliftEntryAndExitManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForkliftEntryAndExitManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkliftEntryAndExitManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
