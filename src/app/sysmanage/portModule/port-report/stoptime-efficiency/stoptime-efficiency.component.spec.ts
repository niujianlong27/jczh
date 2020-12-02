import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoptimeEfficiencyComponent } from './stoptime-efficiency.component';

describe('StoptimeEfficiencyComponent', () => {
  let component: StoptimeEfficiencyComponent;
  let fixture: ComponentFixture<StoptimeEfficiencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoptimeEfficiencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoptimeEfficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
