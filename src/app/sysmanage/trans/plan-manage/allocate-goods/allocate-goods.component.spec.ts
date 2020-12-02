import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateGoodsComponent } from './allocate-goods.component';

describe('AllocateGoodsComponent', () => {
  let component: AllocateGoodsComponent;
  let fixture: ComponentFixture<AllocateGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
