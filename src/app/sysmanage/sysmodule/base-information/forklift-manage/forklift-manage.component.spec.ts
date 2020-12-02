import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftManageComponent } from './forklift-manage.component';

describe('ForkliftManageComponent', () => {
  let component: ForkliftManageComponent;
  let fixture: ComponentFixture<ForkliftManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForkliftManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkliftManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
