import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerthUseAnalysisComponent } from './berth-use-analysis.component';

describe('BerthUseAnalysisComponent', () => {
  let component: BerthUseAnalysisComponent;
  let fixture: ComponentFixture<BerthUseAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerthUseAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerthUseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
