import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoistureValueComponent } from './moisture-value.component';

describe('MoistureValueComponent', () => {
  let component: MoistureValueComponent;
  let fixture: ComponentFixture<MoistureValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoistureValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoistureValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
