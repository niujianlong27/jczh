import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KilometreManageComponent } from './kilometre-manage.component';

describe('KilometreManageComponent', () => {
  let component: KilometreManageComponent;
  let fixture: ComponentFixture<KilometreManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KilometreManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KilometreManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
