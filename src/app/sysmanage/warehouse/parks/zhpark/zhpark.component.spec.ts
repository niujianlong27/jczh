import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhparkComponent } from './zhpark.component';

describe('ZhparkComponent', () => {
  let component: ZhparkComponent;
  let fixture: ComponentFixture<ZhparkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhparkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
