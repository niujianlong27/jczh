import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMapLineComponent } from './modal-map-line.component';

describe('ModalMapLineComponent', () => {
  let component: ModalMapLineComponent;
  let fixture: ComponentFixture<ModalMapLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMapLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
