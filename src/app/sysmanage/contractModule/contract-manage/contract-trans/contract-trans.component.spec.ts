import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTransComponent } from './contract-trans.component';

describe('ContractTransComponent', () => {
  let component: ContractTransComponent;
  let fixture: ComponentFixture<ContractTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
