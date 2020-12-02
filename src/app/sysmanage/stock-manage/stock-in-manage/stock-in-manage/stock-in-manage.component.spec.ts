import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInManageComponent } from './stock-in-manage.component';

describe('StockInManageComponent', () => {
  let component: StockInManageComponent;
  let fixture: ComponentFixture<StockInManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
