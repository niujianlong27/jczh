import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingShipWorkComponent } from './loading-ship-work.component';

describe('LoadingShipWorkComponent', () => {
  let component: LoadingShipWorkComponent;
  let fixture: ComponentFixture<LoadingShipWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingShipWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingShipWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
