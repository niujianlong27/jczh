import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousequeryComponent } from './warehousequery.component';

describe('WarehousequeryComponent', () => {
  let component: WarehousequeryComponent;
  let fixture: ComponentFixture<WarehousequeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehousequeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousequeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
