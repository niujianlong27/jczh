import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineManageComponent } from './line-manage.component';

describe('LineManageComponent', () => {
  let component: LineManageComponent;
  let fixture: ComponentFixture<LineManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
