import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInformationHadComponent } from './invoice-information-had.component';

describe('InvoiceInformationHadComponent', () => {
  let component: InvoiceInformationHadComponent;
  let fixture: ComponentFixture<InvoiceInformationHadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceInformationHadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceInformationHadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
