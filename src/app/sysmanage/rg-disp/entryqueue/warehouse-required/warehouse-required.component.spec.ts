import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseRequiredComponent } from './warehouse-required.component';

describe('WarehouseRequiredComponent', () => {
  let component: WarehouseRequiredComponent;
  let fixture: ComponentFixture<WarehouseRequiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
