import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatkindComponent } from './matkind111.component';

describe('MatkindComponent', () => {
  let component: MatkindComponent;
  let fixture: ComponentFixture<MatkindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatkindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatkindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
