import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquBlockComponent } from './inqu-block.component';

describe('InquBlockComponent', () => {
  let component: InquBlockComponent;
  let fixture: ComponentFixture<InquBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
