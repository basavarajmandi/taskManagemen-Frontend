import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskTableComponent } from './employee-task-table.component';

describe('EmployeeTaskTableComponent', () => {
  let component: EmployeeTaskTableComponent;
  let fixture: ComponentFixture<EmployeeTaskTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeTaskTableComponent]
    });
    fixture = TestBed.createComponent(EmployeeTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
