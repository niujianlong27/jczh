import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTestComponent } from './goods-test.component';

describe('GoodsTestComponent', () => {
  let component: GoodsTestComponent;
  let fixture: ComponentFixture<GoodsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
