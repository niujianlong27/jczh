import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JgwlqueueComponent } from './jgwlqueue.component';

describe('JgwlqueueComponent', () => {
  let component: JgwlqueueComponent;
  let fixture: ComponentFixture<JgwlqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JgwlqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JgwlqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
