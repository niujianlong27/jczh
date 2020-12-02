import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TplButtonsComponent } from './tpl-buttons.component';

describe('TplButtonsComponent', () => {
  let component: TplButtonsComponent;
  let fixture: ComponentFixture<TplButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TplButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TplButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
