import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretenderPublishComponent } from './pretender-publish.component';

describe('PretenderPublishComponent', () => {
  let component: PretenderPublishComponent;
  let fixture: ComponentFixture<PretenderPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretenderPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretenderPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
