import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPopComponent } from './input-pop.component';

describe('InputPopComponent', () => {
  let component: InputPopComponent;
  let fixture: ComponentFixture<InputPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
