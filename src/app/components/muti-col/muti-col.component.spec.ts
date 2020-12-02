import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutiColComponent } from './muti-col.component';

describe('MutiColComponent', () => {
  let component: MutiColComponent;
  let fixture: ComponentFixture<MutiColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutiColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutiColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
