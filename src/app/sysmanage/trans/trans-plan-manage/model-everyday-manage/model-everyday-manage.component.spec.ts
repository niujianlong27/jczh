import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEverydayManageComponent } from './model-everyday-manage.component';

describe('ModelEverydayManageComponent', () => {
  let component: ModelEverydayManageComponent;
  let fixture: ComponentFixture<ModelEverydayManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelEverydayManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelEverydayManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
