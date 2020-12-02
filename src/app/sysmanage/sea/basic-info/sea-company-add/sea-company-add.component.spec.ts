import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaCompanyAddComponent } from './sea-company-add.component';

describe('SeaCompanyAddComponent', () => {
  let component: SeaCompanyAddComponent;
  let fixture: ComponentFixture<SeaCompanyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeaCompanyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeaCompanyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
