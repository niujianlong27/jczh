import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCarsComponent } from './query-cars.component';

describe('QueryCarsComponent', () => {
  let component: QueryCarsComponent;
  let fixture: ComponentFixture<QueryCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
