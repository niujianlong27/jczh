import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemAddServiceComponent } from './plan-item-add-service.component';

describe('PlanItemAddServiceComponent', () => {
  let component: PlanItemAddServiceComponent;
  let fixture: ComponentFixture<PlanItemAddServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanItemAddServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanItemAddServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
