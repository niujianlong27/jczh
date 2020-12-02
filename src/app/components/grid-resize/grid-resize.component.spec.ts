import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridResizeComponent } from './grid-resize.component';

describe('GridResizeComponent', () => {
  let component: GridResizeComponent;
  let fixture: ComponentFixture<GridResizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridResizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
