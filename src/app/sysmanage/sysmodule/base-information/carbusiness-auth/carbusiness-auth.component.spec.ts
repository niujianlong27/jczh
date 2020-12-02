import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbusinessAuthComponent } from './carbusiness-auth.component';

describe('CarbusinessAuthComponent', () => {
  let component: CarbusinessAuthComponent;
  let fixture: ComponentFixture<CarbusinessAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarbusinessAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbusinessAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
