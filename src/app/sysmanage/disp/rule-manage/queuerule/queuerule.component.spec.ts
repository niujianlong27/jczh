import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueruleComponent } from './queuerule.component';

describe('QueueruleComponent', () => {
  let component: QueueruleComponent;
  let fixture: ComponentFixture<QueueruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueruleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
