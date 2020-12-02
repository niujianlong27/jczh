import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdCategorComponent } from './prod-categor.component';

describe('ProdCategorComponent', () => {
  let component: ProdCategorComponent;
  let fixture: ComponentFixture<ProdCategorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdCategorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdCategorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
