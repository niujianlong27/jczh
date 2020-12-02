import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgDispManageComponent } from './rg-disp-manage.component';

describe('RgDispManageComponent', () => {
  let component: RgDispManageComponent;
  let fixture: ComponentFixture<RgDispManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgDispManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgDispManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
