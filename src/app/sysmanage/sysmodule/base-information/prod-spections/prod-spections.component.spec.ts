import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdSpectionsComponent } from './prod-spections.component';

describe('ProdSpectionsComponent', () => {
  let component: ProdSpectionsComponent;
  let fixture: ComponentFixture<ProdSpectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdSpectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdSpectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
