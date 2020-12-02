import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesetComponent } from './codeset.component';

describe('CodesetComponent', () => {
  let component: CodesetComponent;
  let fixture: ComponentFixture<CodesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
