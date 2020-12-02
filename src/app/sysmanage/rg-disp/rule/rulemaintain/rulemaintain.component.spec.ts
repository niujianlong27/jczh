import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulemaintainComponent } from './rulemaintain.component';

describe('RulemaintainComponent', () => {
  let component: RulemaintainComponent;
  let fixture: ComponentFixture<RulemaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulemaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulemaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
