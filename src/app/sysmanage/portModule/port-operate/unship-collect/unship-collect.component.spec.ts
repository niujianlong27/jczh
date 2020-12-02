import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnshipCollectComponent } from './unship-collect.component';

describe('UnshipCollectComponent', () => {
  let component: UnshipCollectComponent;
  let fixture: ComponentFixture<UnshipCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnshipCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnshipCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
