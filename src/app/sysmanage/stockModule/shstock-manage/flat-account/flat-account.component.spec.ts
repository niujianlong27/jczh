import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAccountComponent } from './flat-account.component';

describe('FlatAccountComponent', () => {
  let component: FlatAccountComponent;
  let fixture: ComponentFixture<FlatAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
