import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadameterAddComponent } from './loadameter-add.component';

describe('LoadameterAddComponent', () => {
  let component: LoadameterAddComponent;
  let fixture: ComponentFixture<LoadameterAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadameterAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadameterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
