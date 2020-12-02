import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateGoodsAddComponent } from './allocate-goods-add.component';

describe('AllocateGoodsAddComponent', () => {
  let component: AllocateGoodsAddComponent;
  let fixture: ComponentFixture<AllocateGoodsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateGoodsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateGoodsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
