import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShstockInfoComponent } from './shstock-info.component';

describe('ShstockInfoComponent', () => {
  let component: ShstockInfoComponent;
  let fixture: ComponentFixture<ShstockInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShstockInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShstockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
