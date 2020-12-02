import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalCraneCollectComponent } from './portal-crane-collect.component';

describe('PortalCraneCollectComponent', () => {
  let component: PortalCraneCollectComponent;
  let fixture: ComponentFixture<PortalCraneCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalCraneCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalCraneCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
