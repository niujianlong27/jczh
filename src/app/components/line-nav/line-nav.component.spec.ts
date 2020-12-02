import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineNavComponent } from './line-nav.component';

describe('LineNavComponent', () => {
  let component: LineNavComponent;
  let fixture: ComponentFixture<LineNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
