import { Component, ViewChild } from '@angular/core';
import { TaskDTO } from '../models/task-dto';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/modules/employee/services/employee.service';
import { FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

@Component({
  selector: 'app-employee-task-table',
  templateUrl: './employee-task-table.component.html',
  styleUrls: ['./employee-task-table.component.scss']
})
export class EmployeeTaskTableComponent {
  loggedInUserId!: number; // Define the property
  isFilterPanelOpen: any;
  listOfTasks: any[] = [];
  isPanelExpanded: boolean = false;
  searchTaskForm!: FormGroup;
  categories: string[] = []; // Store categories

  displayedColumns: string[] = [
    'id',
    'employeeName',
    'title',
    'description',
    'priority',
    'dueDate',
    'taskStatus',
    'categoryName'
  ];

  dataSource = new MatTableDataSource<TaskDTO>(); 
  totalTasks = 0;
  pageSize = 5;
  pageIndex = 0;
  sortField = 'id';               
  sortDirection = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService) { }
  ngOnInit(): void {
    this.loadTasks();
   // this.loggedInUserId = Number(StorageService.getUserId()); // Convert string to number
  }

  loadTasks(): void {
    this.employeeService
      .getPaginatedTasksByUserId(this.pageIndex, this.pageSize, this.sortField, this.sortDirection)
      .subscribe(response => {
        this.dataSource.data = response.content;
        this.totalTasks = response.totalElements;
        this.pageSize = response.size;
        this.pageIndex = response.page;
        // ✅ Ensure sorting works
        this.dataSource.sort = this.sort; 
      });
  }

  paginate(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadTasks();
  }

  sortData(event: Sort): void {
    this.sortField = event.active;
    this.sortDirection = event.direction || 'asc';
    this.pageIndex = 0; // ✅ Reset page when sorting
    this.loadTasks();
  }

  applyFilter(){}
  clearFilter(){}
}
