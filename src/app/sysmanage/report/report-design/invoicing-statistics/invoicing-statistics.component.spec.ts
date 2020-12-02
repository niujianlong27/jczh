import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingStatisticsComponent } from './invoicing-statistics.component';

describe('InvoicingStatisticsComponent', () => {
  let component: InvoicingStatisticsComponent;
  let fixture: ComponentFixture<InvoicingStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicingStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
