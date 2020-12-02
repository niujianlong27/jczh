import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrustAddComponent } from './entrust-add.component';

describe('EntrustAddComponent', () => {
  let component: EntrustAddComponent;
  let fixture: ComponentFixture<EntrustAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrustAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrustAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
