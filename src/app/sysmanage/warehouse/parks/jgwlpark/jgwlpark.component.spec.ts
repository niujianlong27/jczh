import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JgwlparkComponent } from './jgwlpark.component';

describe('JgwlparkComponent', () => {
  let component: JgwlparkComponent;
  let fixture: ComponentFixture<JgwlparkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JgwlparkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JgwlparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
