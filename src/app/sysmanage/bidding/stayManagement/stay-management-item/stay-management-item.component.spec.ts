import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayManagementItemComponent } from './stay-management-item.component';

describe('StayManagementItemComponent', () => {
  let component: StayManagementItemComponent;
  let fixture: ComponentFixture<StayManagementItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayManagementItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayManagementItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
