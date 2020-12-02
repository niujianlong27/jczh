import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineProdManageComponent } from './line-prod-manage.component';

describe('LineProdManageComponent', () => {
  let component: LineProdManageComponent;
  let fixture: ComponentFixture<LineProdManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineProdManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineProdManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
