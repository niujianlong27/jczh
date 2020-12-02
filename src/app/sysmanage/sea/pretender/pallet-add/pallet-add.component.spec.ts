import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletAddComponent } from './pallet-add.component';

describe('PalletAddComponent', () => {
  let component: PalletAddComponent;
  let fixture: ComponentFixture<PalletAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalletAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
