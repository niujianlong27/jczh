import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceLineComponent } from './price-line.component';

describe('PriceLineComponent', () => {
  let component: PriceLineComponent;
  let fixture: ComponentFixture<PriceLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
