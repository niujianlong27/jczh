import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitCargoComponent } from './split-cargo.component';

describe('SplitCargoComponent', () => {
  let component: SplitCargoComponent;
  let fixture: ComponentFixture<SplitCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
