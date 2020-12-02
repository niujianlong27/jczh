import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShstockInAddComponent } from './shstock-in-add.component';

describe('ShstockInAddComponent', () => {
  let component: ShstockInAddComponent;
  let fixture: ComponentFixture<ShstockInAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShstockInAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShstockInAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
