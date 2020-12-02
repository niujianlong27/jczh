import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnstandPointManageComponent } from './unstand-point-manage.component';

describe('UnstandPointManageComponent', () => {
  let component: UnstandPointManageComponent;
  let fixture: ComponentFixture<UnstandPointManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnstandPointManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnstandPointManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
