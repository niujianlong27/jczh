import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleGoodsComponent } from './bicycle-goods.component';

describe('BicycleGoodsComponent', () => {
  let component: BicycleGoodsComponent;
  let fixture: ComponentFixture<BicycleGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BicycleGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
