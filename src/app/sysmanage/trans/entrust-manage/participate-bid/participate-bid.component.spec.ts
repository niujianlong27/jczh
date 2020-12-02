import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipateBidComponent } from './participate-bid.component';

describe('ParticipateBidComponent', () => {
  let component: ParticipateBidComponent;
  let fixture: ComponentFixture<ParticipateBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipateBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipateBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
