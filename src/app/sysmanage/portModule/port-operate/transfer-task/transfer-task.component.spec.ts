import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTaskComponent } from './transfer-task.component';

describe('TransferTaskComponent', () => {
  let component: TransferTaskComponent;
  let fixture: ComponentFixture<TransferTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
