import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetconfigureComponent } from './setconfigure.component';

describe('SetconfigureComponent', () => {
  let component: SetconfigureComponent;
  let fixture: ComponentFixture<SetconfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetconfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetconfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
