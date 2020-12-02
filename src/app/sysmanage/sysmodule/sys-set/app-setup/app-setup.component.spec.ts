import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSetupComponent } from './app-setup.component';

describe('AppSetupComponent', () => {
  let component: AppSetupComponent;
  let fixture: ComponentFixture<AppSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
