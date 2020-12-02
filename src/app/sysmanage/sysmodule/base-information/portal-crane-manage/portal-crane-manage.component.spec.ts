import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalCraneManageComponent } from './portal-crane-manage.component';

describe('PortalCraneManageComponent', () => {
  let component: PortalCraneManageComponent;
  let fixture: ComponentFixture<PortalCraneManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalCraneManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalCraneManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
