import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevWriteOff2Component } from './rev-write-off2.component';

describe('RevWriteOff2Component', () => {
  let component: RevWriteOff2Component;
  let fixture: ComponentFixture<RevWriteOff2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevWriteOff2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevWriteOff2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
