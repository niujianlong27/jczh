import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransTaskComponent } from './trans-task.component';

describe('TransTaskComponent', () => {
  let component: TransTaskComponent;
  let fixture: ComponentFixture<TransTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
