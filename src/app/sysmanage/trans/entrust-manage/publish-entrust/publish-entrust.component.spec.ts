import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishEntrustComponent } from './publish-entrust.component';

describe('PublishEntrustComponent', () => {
  let component: PublishEntrustComponent;
  let fixture: ComponentFixture<PublishEntrustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishEntrustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishEntrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
