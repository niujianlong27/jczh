import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebidComponent } from './prebid.component';

describe('PrebidComponent', () => {
  let component: PrebidComponent;
  let fixture: ComponentFixture<PrebidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
