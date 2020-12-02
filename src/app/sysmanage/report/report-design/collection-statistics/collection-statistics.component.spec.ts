import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionStatisticsComponent } from './collection-statistics.component';

describe('CollectionStatisticsComponent', () => {
  let component: CollectionStatisticsComponent;
  let fixture: ComponentFixture<CollectionStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
