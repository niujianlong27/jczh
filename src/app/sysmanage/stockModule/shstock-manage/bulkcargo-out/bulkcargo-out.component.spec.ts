import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkcargoOutComponent } from './bulkcargo-out.component';

describe('BulkcargoOutComponent', () => {
  let component: BulkcargoOutComponent;
  let fixture: ComponentFixture<BulkcargoOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkcargoOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkcargoOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
