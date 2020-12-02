import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSchedulingComponent } from './warehouse-scheduling.component';

describe('WarehouseSchedulingComponent', () => {
  let component: WarehouseSchedulingComponent;
  let fixture: ComponentFixture<WarehouseSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
