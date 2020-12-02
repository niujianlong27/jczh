import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealqueryComponent } from './dealquery.component';

describe('DealqueryComponent', () => {
  let component: DealqueryComponent;
  let fixture: ComponentFixture<DealqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
