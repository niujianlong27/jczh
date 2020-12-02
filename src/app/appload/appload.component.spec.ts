import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApploadComponent } from './appload.component';

describe('ApploadComponent', () => {
  let component: ApploadComponent;
  let fixture: ComponentFixture<ApploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
