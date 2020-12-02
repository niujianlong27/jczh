import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransqueryComponent } from './transquery.component';

describe('TransqueryComponent', () => {
  let component: TransqueryComponent;
  let fixture: ComponentFixture<TransqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
