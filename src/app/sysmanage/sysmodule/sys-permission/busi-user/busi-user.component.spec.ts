import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusiUserComponent } from './busi-user.component';

describe('BusiUserComponent', () => {
  let component: BusiUserComponent;
  let fixture: ComponentFixture<BusiUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusiUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
