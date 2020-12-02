import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryConditionComponent } from './query-condition.component';

describe('QueryConditionComponent', () => {
  let component: QueryConditionComponent;
  let fixture: ComponentFixture<QueryConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
