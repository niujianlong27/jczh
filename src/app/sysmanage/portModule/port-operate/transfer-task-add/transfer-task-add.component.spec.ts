import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTaskAddComponent } from './transfer-task-add.component';

describe('TransferTaskAddComponent', () => {
  let component: TransferTaskAddComponent;
  let fixture: ComponentFixture<TransferTaskAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTaskAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
