import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskTableComponent } from './view-task-table.component';

describe('ViewTaskTableComponent', () => {
  let component: ViewTaskTableComponent;
  let fixture: ComponentFixture<ViewTaskTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTaskTableComponent]
    });
    fixture = TestBed.createComponent(ViewTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
