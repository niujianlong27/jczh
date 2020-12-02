import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Searchform2Component } from './searchform2.component';

describe('SearchformComponent', () => {
  let component: Searchform2Component;
  let fixture: ComponentFixture<Searchform2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Searchform2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Searchform2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
