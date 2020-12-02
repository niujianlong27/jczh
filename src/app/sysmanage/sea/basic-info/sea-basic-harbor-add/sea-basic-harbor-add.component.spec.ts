import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaBasicHarborAddComponent } from './sea-basic-harbor-add.component';

describe('SeaBasicHarborAddComponent', () => {
  let component: SeaBasicHarborAddComponent;
  let fixture: ComponentFixture<SeaBasicHarborAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeaBasicHarborAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeaBasicHarborAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
