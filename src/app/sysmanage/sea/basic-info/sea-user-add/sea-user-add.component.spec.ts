import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaUserAddComponent } from './sea-user-add.component';

describe('SeaUserAddComponent', () => {
  let component: SeaUserAddComponent;
  let fixture: ComponentFixture<SeaUserAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeaUserAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeaUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
