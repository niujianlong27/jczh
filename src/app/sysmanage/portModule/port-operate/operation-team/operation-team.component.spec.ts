import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTeamComponent } from './operation-team.component';

describe('OperationTeamComponent', () => {
  let component: OperationTeamComponent;
  let fixture: ComponentFixture<OperationTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
