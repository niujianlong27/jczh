import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeStockComponent } from './notice-stock.component';

describe('NoticeStockComponent', () => {
  let component: NoticeStockComponent;
  let fixture: ComponentFixture<NoticeStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
