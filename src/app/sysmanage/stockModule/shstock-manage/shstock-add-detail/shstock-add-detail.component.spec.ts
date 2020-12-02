import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShstockAddDetailComponent } from './shstock-add-detail.component';

describe('ShstockAddDetailComponent', () => {
  let component: ShstockAddDetailComponent;
  let fixture: ComponentFixture<ShstockAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShstockAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShstockAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
