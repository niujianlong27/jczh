import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StparkComponent } from './stpark.component';

describe('StparkComponent', () => {
  let component: StparkComponent;
  let fixture: ComponentFixture<StparkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StparkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
