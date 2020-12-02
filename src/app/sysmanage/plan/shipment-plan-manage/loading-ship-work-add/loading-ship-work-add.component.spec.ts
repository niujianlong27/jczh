import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingShipWorkAddComponent } from './loading-ship-work-add.component';

describe('LoadingShipWorkAddComponent', () => {
  let component: LoadingShipWorkAddComponent;
  let fixture: ComponentFixture<LoadingShipWorkAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingShipWorkAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingShipWorkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
