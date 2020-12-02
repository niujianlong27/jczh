import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageGoodsComponent } from './home-page-goods.component';

describe('HomePageGoodsComponent', () => {
  let component: HomePageGoodsComponent;
  let fixture: ComponentFixture<HomePageGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
