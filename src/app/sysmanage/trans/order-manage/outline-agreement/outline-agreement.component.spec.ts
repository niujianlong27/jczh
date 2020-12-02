import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineAgreementComponent } from './outline-agreement.component';

describe('OutlineAgreementComponent', () => {
  let component: OutlineAgreementComponent;
  let fixture: ComponentFixture<OutlineAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlineAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlineAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
