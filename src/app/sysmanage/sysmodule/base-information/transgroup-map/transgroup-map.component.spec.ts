import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransgroupMapComponent } from './transgroup-map.component';

describe('TransgroupMapComponent', () => {
  let component: TransgroupMapComponent;
  let fixture: ComponentFixture<TransgroupMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransgroupMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransgroupMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
