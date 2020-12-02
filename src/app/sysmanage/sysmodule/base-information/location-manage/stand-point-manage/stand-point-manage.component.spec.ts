import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandPointManageComponent } from './stand-point-manage.component';

describe('StandPointManageComponent', () => {
  let component: StandPointManageComponent;
  let fixture: ComponentFixture<StandPointManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandPointManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandPointManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
