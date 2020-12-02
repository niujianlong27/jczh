import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayChannelListComponent } from './pay-channel-list.component';

describe('PayChannelListComponent', () => {
  let component: PayChannelListComponent;
  let fixture: ComponentFixture<PayChannelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayChannelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
