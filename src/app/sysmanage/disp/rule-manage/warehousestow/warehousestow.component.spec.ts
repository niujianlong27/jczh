import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousestowComponent } from './warehousestow.component';

describe('WarehousestowComponent', () => {
  let component: WarehousestowComponent;
  let fixture: ComponentFixture<WarehousestowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehousestowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousestowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
