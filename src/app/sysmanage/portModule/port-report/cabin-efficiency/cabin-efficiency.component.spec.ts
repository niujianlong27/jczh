import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinEfficiencyComponent } from './cabin-efficiency.component';

describe('CabinEfficiencyComponent', () => {
  let component: CabinEfficiencyComponent;
  let fixture: ComponentFixture<CabinEfficiencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabinEfficiencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinEfficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
