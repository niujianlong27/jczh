import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformaPermissonAddComponent } from './platforma-permisson-add.component';

describe('PlatformaPermissonAddComponent', () => {
  let component: PlatformaPermissonAddComponent;
  let fixture: ComponentFixture<PlatformaPermissonAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformaPermissonAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformaPermissonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
