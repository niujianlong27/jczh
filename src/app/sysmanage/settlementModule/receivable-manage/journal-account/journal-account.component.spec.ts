import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAccountComponent } from './journal-account.component';

describe('JournalAccountComponent', () => {
  let component: JournalAccountComponent;
  let fixture: ComponentFixture<JournalAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
