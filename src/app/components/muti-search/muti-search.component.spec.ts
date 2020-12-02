import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutiSearchComponent } from './muti-search.component';

describe('MutiSearchComponent', () => {
  let component: MutiSearchComponent;
  let fixture: ComponentFixture<MutiSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutiSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
