import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommomAddressManageComponent } from './commom-address-manage.component';

describe('CommomAddressManageComponent', () => {
  let component: CommomAddressManageComponent;
  let fixture: ComponentFixture<CommomAddressManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommomAddressManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommomAddressManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
