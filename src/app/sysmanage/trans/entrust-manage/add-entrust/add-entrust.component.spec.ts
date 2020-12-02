import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntrustComponent } from './add-entrust.component';

describe('AddEntrustComponent', () => {
  let component: AddEntrustComponent;
  let fixture: ComponentFixture<AddEntrustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntrustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
