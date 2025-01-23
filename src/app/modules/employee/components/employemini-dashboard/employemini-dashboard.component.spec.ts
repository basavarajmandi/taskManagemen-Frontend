import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeminiDashboardComponent } from './employemini-dashboard.component';

describe('EmployeminiDashboardComponent', () => {
  let component: EmployeminiDashboardComponent;
  let fixture: ComponentFixture<EmployeminiDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeminiDashboardComponent]
    });
    fixture = TestBed.createComponent(EmployeminiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
