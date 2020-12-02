import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformPermissonComponent } from './platform-permisson.component';

describe('PlatformPermissonComponent', () => {
  let component: PlatformPermissonComponent;
  let fixture: ComponentFixture<PlatformPermissonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformPermissonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformPermissonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
