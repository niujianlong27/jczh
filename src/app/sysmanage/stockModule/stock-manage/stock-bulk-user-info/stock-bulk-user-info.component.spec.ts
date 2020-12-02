import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkUserInfoComponent } from './stock-bulk-user-info.component';

describe('StockBulkUserInfoComponent', () => {
  let component: StockBulkUserInfoComponent;
  let fixture: ComponentFixture<StockBulkUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
