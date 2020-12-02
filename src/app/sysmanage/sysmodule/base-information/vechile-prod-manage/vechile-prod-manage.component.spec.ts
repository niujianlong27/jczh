import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VechileProdManageComponent } from './vechile-prod-manage.component';

describe('VechileProdManageComponent', () => {
  let component: VechileProdManageComponent;
  let fixture: ComponentFixture<VechileProdManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VechileProdManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VechileProdManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
