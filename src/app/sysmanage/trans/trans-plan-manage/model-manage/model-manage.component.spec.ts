import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelManageComponent } from './model-manage.component';

describe('ModelManageComponent', () => {
  let component: ModelManageComponent;
  let fixture: ComponentFixture<ModelManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
