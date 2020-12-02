import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUserBidComponent } from './company-user-bid.component';

describe('CompanyUserBidComponent', () => {
  let component: CompanyUserBidComponent;
  let fixture: ComponentFixture<CompanyUserBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUserBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUserBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
