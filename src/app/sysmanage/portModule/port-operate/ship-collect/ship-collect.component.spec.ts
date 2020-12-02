import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipCollectComponent } from './ship-collect.component';

describe('ShipCollectComponent', () => {
  let component: ShipCollectComponent;
  let fixture: ComponentFixture<ShipCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
