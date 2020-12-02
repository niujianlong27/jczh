import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynerrComponent } from './synerr.component';

describe('SynerrComponent', () => {
  let component: SynerrComponent;
  let fixture: ComponentFixture<SynerrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynerrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynerrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
