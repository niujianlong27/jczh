import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntrustDistributionComponent } from './new-entrust-distribution.component';

describe('NewEntrustDistributionComponent', () => {
  let component: NewEntrustDistributionComponent;
  let fixture: ComponentFixture<NewEntrustDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEntrustDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntrustDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
