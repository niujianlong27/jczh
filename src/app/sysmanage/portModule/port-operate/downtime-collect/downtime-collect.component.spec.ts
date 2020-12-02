import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeCollectComponent } from './downtime-collect.component';

describe('DowntimeCollectComponent', () => {
  let component: DowntimeCollectComponent;
  let fixture: ComponentFixture<DowntimeCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DowntimeCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DowntimeCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
