import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipLoadingComponent } from './ship-loading.component';

describe('ShipLoadingComponent', () => {
  let component: ShipLoadingComponent;
  let fixture: ComponentFixture<ShipLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
