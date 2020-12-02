import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingqueryComponent } from './incomingquery.component';

describe('IncomingqueryComponent', () => {
  let component: IncomingqueryComponent;
  let fixture: ComponentFixture<IncomingqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
