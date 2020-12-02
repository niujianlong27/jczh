import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseVarietiesSetComponent } from './warehouse-varieties-set.component';

describe('WarehouseVarietiesSetComponent', () => {
  let component: WarehouseVarietiesSetComponent;
  let fixture: ComponentFixture<WarehouseVarietiesSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseVarietiesSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseVarietiesSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
