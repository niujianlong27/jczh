import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOutManageComponent } from './store-out-manage.component';

describe('StoreOutManageComponent', () => {
  let component: StoreOutManageComponent;
  let fixture: ComponentFixture<StoreOutManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreOutManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOutManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
