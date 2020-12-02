import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemAddComponent } from './plan-item-add.component';

describe('PlanItemAddComponent', () => {
  let component: PlanItemAddComponent;
  let fixture: ComponentFixture<PlanItemAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanItemAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
