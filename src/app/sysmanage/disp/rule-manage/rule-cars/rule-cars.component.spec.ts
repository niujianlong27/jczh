import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCarsComponent } from './rule-cars.component';

describe('RuleCarsComponent', () => {
  let component: RuleCarsComponent;
  let fixture: ComponentFixture<RuleCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
