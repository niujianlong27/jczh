import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KingdeeComponent } from './kingdee.component';

describe('KingdeeComponent', () => {
  let component: KingdeeComponent;
  let fixture: ComponentFixture<KingdeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KingdeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KingdeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
