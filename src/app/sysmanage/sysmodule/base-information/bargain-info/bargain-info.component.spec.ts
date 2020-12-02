import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BargainInfoComponent } from './bargain-info.component';

describe('BargainInfoComponent', () => {
  let component: BargainInfoComponent;
  let fixture: ComponentFixture<BargainInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BargainInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BargainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
