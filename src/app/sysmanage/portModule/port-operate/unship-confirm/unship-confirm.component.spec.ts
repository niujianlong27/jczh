import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnshipConfirmComponent } from './unship-confirm.component';

describe('UnshipConfirmComponent', () => {
  let component: UnshipConfirmComponent;
  let fixture: ComponentFixture<UnshipConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnshipConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnshipConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
