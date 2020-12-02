import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryKindComponent } from './entry-kind.component';

describe('EntryKindComponent', () => {
  let component: EntryKindComponent;
  let fixture: ComponentFixture<EntryKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
