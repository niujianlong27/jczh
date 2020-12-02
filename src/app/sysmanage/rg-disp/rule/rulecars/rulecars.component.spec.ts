import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulecarsComponent } from './rulecars.component';

describe('RulecarsComponent', () => {
  let component: RulecarsComponent;
  let fixture: ComponentFixture<RulecarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulecarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulecarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
