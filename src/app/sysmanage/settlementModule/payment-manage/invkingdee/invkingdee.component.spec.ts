import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvkingdeeComponent } from './invkingdee.component';

describe('InvkingdeeComponent', () => {
  let component: InvkingdeeComponent;
  let fixture: ComponentFixture<InvkingdeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvkingdeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvkingdeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
