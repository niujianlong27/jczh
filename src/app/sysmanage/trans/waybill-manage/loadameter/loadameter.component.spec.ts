import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadameterComponent } from './loadameter.component';

describe('LoadameterComponent', () => {
  let component: LoadameterComponent;
  let fixture: ComponentFixture<LoadameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
