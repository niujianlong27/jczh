import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OilUnfreezeComponent } from './oil-unfreeze.component';

describe('OilUnfreezeComponent', () => {
  let component: OilUnfreezeComponent;
  let fixture: ComponentFixture<OilUnfreezeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OilUnfreezeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OilUnfreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
