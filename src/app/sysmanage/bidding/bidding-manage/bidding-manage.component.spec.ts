import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingManageComponent } from './bidding-manage.component';

describe('BiddingManageComponent', () => {
  let component: BiddingManageComponent;
  let fixture: ComponentFixture<BiddingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiddingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiddingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
