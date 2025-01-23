import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employemini-dashboard',
  templateUrl: './employemini-dashboard.component.html',
  styleUrls: ['./employemini-dashboard.component.scss']
})
export class EmployeminiDashboardComponent {


  constructor(private employeService: EmployeeService){}

}
