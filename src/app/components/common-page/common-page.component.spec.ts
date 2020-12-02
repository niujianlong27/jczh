import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPageComponent } from './common-page.component';

describe('CommonPageComponent', () => {
  let component: CommonPageComponent;
  let fixture: ComponentFixture<CommonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
