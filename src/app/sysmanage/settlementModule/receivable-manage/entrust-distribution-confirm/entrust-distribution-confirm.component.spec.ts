import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrustDistributionConfirmComponent } from './entrust-distribution-confirm.component';

describe('EntrustDistributionConfirmComponent', () => {
  let component: EntrustDistributionConfirmComponent;
  let fixture: ComponentFixture<EntrustDistributionConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrustDistributionConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrustDistributionConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
