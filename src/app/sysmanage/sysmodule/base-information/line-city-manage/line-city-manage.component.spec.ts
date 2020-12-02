import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineCityManageComponent } from './line-city-manage.component';

describe('LineCityManageComponent', () => {
  let component: LineCityManageComponent;
  let fixture: ComponentFixture<LineCityManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineCityManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineCityManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
