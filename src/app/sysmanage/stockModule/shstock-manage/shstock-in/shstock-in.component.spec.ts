import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShstockInComponent } from './shstock-in.component';

describe('ShstockInComponent', () => {
  let component: ShstockInComponent;
  let fixture: ComponentFixture<ShstockInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShstockInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShstockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
