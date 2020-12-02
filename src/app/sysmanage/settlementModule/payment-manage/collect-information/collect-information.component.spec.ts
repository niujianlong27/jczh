import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectInformationComponent } from './collect-information.component';

describe('CollectInformationComponent', () => {
  let component: CollectInformationComponent;
  let fixture: ComponentFixture<CollectInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
