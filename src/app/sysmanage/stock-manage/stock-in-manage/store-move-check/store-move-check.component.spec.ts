import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMoveCheckComponent } from './store-move-check.component';

describe('StoreMoveCheckComponent', () => {
  let component: StoreMoveCheckComponent;
  let fixture: ComponentFixture<StoreMoveCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMoveCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMoveCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
