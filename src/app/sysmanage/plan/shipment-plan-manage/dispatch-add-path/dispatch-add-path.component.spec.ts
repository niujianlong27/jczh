import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAddPathComponent } from './dispatch-add-path.component';

describe('DispatchAddPathComponent', () => {
  let component: DispatchAddPathComponent;
  let fixture: ComponentFixture<DispatchAddPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchAddPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchAddPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
