import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerthManageComponent } from './berth-manage.component';

describe('BerthManageComponent', () => {
  let component: BerthManageComponent;
  let fixture: ComponentFixture<BerthManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerthManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerthManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
