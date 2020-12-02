import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayChannelAddComponent } from './pay-channel-add.component';

describe('PayChannelAddComponent', () => {
  let component: PayChannelAddComponent;
  let fixture: ComponentFixture<PayChannelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayChannelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayChannelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
