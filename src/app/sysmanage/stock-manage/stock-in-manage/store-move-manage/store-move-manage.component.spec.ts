import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMoveManageComponent } from './store-move-manage.component';

describe('StoreMoveManageComponent', () => {
  let component: StoreMoveManageComponent;
  let fixture: ComponentFixture<StoreMoveManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMoveManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMoveManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
