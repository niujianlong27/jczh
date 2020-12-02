import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipMentComponent } from './ship-ment.component';

describe('ShipMentComponent', () => {
  let component: ShipMentComponent;
  let fixture: ComponentFixture<ShipMentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipMentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipMentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
