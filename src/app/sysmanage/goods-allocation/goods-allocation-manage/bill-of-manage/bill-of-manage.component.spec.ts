import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfManageComponent } from './bill-of-manage.component';

describe('BillOfManageComponent', () => {
  let component: BillOfManageComponent;
  let fixture: ComponentFixture<BillOfManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillOfManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
