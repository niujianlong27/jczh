import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrustDistributionComponent } from './entrust-distribution.component';

describe('EntrustDistributionComponent', () => {
  let component: EntrustDistributionComponent;
  let fixture: ComponentFixture<EntrustDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrustDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrustDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
