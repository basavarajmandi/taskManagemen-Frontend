import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskDTO, TaskStatus } from '../models/task-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { PaginatedResponse } from '../models/paginated-response';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-view-task-table',
  templateUrl: './view-task-table.component.html',
  styleUrls: ['./view-task-table.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('hidden', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', [
        animate('0.5s ease-in-out')
      ])
    ])
  ],
})
export class ViewTaskTableComponent implements OnInit {
  //dataSource:TaskDTO[]=[];
  allCategories: string[] = []; // Store existing category names
  animationState = 'hidden';
  isFilterPanelOpen: any;
  isPanelExpanded = false;
  searchTaskForm!: FormGroup;// Animation state
  displayedColumns: string[] =

    ['id',
      'employeeName',
      'title',
      'description',
      'priority',
      'dueDate',
      'taskStatus',
      'categoryName',
    ];

  dataSource = new MatTableDataSource<TaskDTO>([]);
  totalTasks: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  sortField: string = 'id';
  sortDirection: string = 'asc';

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  //service: any;
  //listOfTasks: any = [];

  constructor(private adminService: AdminService, 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchTasks(); // Initial fetch of tasks
    this.initializeForm();
    this.getAllCategories();
  }

  // Fetch all categories name only  from the backend
  getAllCategories() {
    this.adminService.getAllCategories().subscribe(
      (categories: string[]) => {
        this.allCategories = categories; // Store categories in the array
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Update sorting on user interaction
    this.animationState = 'visible';
    this.dataSource.sort = this.sort; // Bind sort
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.sortField = sort.active || 'id'; // Set the active field or default to 'id'
      this.sortDirection = sort.direction || 'asc';
      //this.pageIndex = 0; // Reset to first page on sort change
      this.fetchTasks();
    });
  }

  /** 🔹 1. Initialize Form */
  initializeForm(): void {
    this.searchTaskForm = this.fb.group({
      employeeName: [''],
      title: [''],
      taskStatus: [''],
      priority: [''],
      dueDate: [''],
      categoryNames: [[]] // Added categoryNames field
    });
  }
  //  Fetch Tasks (Default & After Filtering) 
  fetchTasks(): void {
    const params = {
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sortField,
      direction: this.sortDirection,
    };

    this.adminService.getAllTaskWithPagination(params).subscribe(
      (response: PaginatedResponse) => {
        this.dataSource.data = response.content; // Update table data
        this.totalTasks = response.totalElements; // Update total task count
        this.pageSize = response.size; // Update page size
        this.pageIndex = response.page; // Update current page index
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  paginate(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchTasks(); // Fetch tasks with updated page and pageSize
  }

  // Apply filter to tasks
  applyFilter(): void {
    const formValues = this.searchTaskForm.value;
    // const priority: string | undefined = formValues.priority || undefined;
    const priority: string[] | undefined =
      formValues.priority && Array.isArray(formValues.priority) ? formValues.priority :
        formValues.priority ? [formValues.priority] : undefined;

    const title: string | undefined = formValues.title || undefined;
    const employeeName: string | undefined = formValues.employeeName || undefined;
    // const taskStatus: string | undefined = formValues.taskStatus || undefined; for onlu single

    // Ensure that taskStatus is always an array
    const taskStatus: string[] | undefined =
      formValues.taskStatus && Array.isArray(formValues.taskStatus) ? formValues.taskStatus :
        formValues.taskStatus ? [formValues.taskStatus] : undefined;

    // Ensure dueDate is sent in YYYY-MM-DD format to match backend expectations
    const dueDate: string | undefined = formValues.dueDate ? new Date(formValues.dueDate.getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0] : undefined;

    const categoryNames: string[] | undefined = formValues?.categoryNames
      ? (Array.isArray(formValues.categoryNames) ? formValues.categoryNames : [formValues.categoryNames])
      : undefined;

    console.log('Filter values:', { title, priority, dueDate, taskStatus, employeeName });
    this.adminService.filterTasks(priority, title, dueDate, taskStatus, employeeName, categoryNames).subscribe(
      (res: TaskDTO[]) => {
        // this.listOfTasks = res;
        this.dataSource.data = res;
        console.log('Filtered Tasks:', res);
      },
      (err: any) => {
        console.error('Error applying filters:', err);
        this.snackbar.open('Error applying filters. Please try again!', 'Close', { duration: 5000 });
      }
    );
  }

  clearFilter(): void {
    this.searchTaskForm.reset();
    this.fetchTasks();
  }

}
// exportToExcel(): void { first writing this method in her later i put this export to excel method in footerdelogcompunent 
//   this.adminService.exportToExcel().subscribe(
//     (blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'tasks.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     },
//     (error) => {
//       console.error('Error exporting to Excel:', error);
//       this.snackbar.open('Failed to export tasks!', 'Close', {
//         duration: 3000,
//       });
//     }
//   );
// }


// fetchTasks():void {
//   this.adminService.getAllTaskwithtable().subscribe((data : TaskDTO[])=>{
// this.dataSource=data;
// console.log(data);
//  //this.initializeTable();
//   })

// }