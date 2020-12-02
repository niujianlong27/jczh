import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradEntrustedComponent } from './grad-entrusted.component';

describe('GradEntrustedComponent', () => {
  let component: GradEntrustedComponent;
  let fixture: ComponentFixture<GradEntrustedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradEntrustedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradEntrustedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
