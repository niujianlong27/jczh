import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParasettingComponent } from './parasetting.component';

describe('ParasettingComponent', () => {
  let component: ParasettingComponent;
  let fixture: ComponentFixture<ParasettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParasettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParasettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
