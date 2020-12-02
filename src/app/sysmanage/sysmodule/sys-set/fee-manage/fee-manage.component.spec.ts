import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeManageComponent } from './fee-manage.component';

describe('FeeManageComponent', () => {
  let component: FeeManageComponent;
  let fixture: ComponentFixture<FeeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
