import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrustInfoComponent } from './entrust-info.component';

describe('EntrustInfoComponent', () => {
  let component: EntrustInfoComponent;
  let fixture: ComponentFixture<EntrustInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrustInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrustInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
