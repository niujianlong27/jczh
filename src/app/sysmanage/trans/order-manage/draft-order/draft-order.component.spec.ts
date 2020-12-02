import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftOrderComponent } from './draft-order.component';

describe('DraftOrderComponent', () => {
  let component: DraftOrderComponent;
  let fixture: ComponentFixture<DraftOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
