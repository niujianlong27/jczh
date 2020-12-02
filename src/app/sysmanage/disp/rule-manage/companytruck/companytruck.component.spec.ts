import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanytruckComponent } from './companytruck.component';

describe('CompanytruckComponent', () => {
  let component: CompanytruckComponent;
  let fixture: ComponentFixture<CompanytruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanytruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanytruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
