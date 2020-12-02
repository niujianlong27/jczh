import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStaticDataComponent } from './company-static-data.component';

describe('CompanyStaticDataComponent', () => {
  let component: CompanyStaticDataComponent;
  let fixture: ComponentFixture<CompanyStaticDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyStaticDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStaticDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
