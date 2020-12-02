import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeStockInfoComponent } from './notice-stock-info.component';

describe('NoticeStockInfoComponent', () => {
  let component: NoticeStockInfoComponent;
  let fixture: ComponentFixture<NoticeStockInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeStockInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeStockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
