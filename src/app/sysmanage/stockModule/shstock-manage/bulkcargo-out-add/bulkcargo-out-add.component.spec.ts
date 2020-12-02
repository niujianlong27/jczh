import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkcargoOutAddComponent } from './bulkcargo-out-add.component';

describe('BulkcargoOutAddComponent', () => {
  let component: BulkcargoOutAddComponent;
  let fixture: ComponentFixture<BulkcargoOutAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkcargoOutAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkcargoOutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
