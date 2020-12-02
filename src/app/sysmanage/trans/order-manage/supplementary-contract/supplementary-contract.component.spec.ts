import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryContractComponent } from './supplementary-contract.component';

describe('SupplementaryContractComponent', () => {
  let component: SupplementaryContractComponent;
  let fixture: ComponentFixture<SupplementaryContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
