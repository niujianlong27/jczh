import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretenderPalletAddComponent } from './pretender-pallet-add.component';

describe('PretenderPalletAddComponent', () => {
  let component: PretenderPalletAddComponent;
  let fixture: ComponentFixture<PretenderPalletAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretenderPalletAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretenderPalletAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
