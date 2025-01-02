import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
})
export class MainDashboardComponent {

  public pieChartData: ChartData<'pie'> | undefined;
  public barChartData: ChartData<'bar'> | undefined;
  public overdueTaskCount: number=0; // Declare and initialize

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Task Status Overview'
      }
    }
  };
 


  // public pieChartOptions: ChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Task Distribution (Pie Chart)',
  //     },
  //   },
  // };
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTaskData();
    this.loadTaskStatusCounts();
    this.loadOverdueTaskCount();
  }

  loadTaskData() {
    this.adminService.getAllTask().subscribe((tasks) => {
      const statusCounts = this.groupTasksByStatus(tasks);
      this.setPieChartData(statusCounts);
     // this.setBarChartData(statusCounts);
    });
  }

  groupTasksByStatus(tasks: any[]): { [status: string]: number } {
    const statusCounts: { [status: string]: number } = {};
    tasks.forEach((task) => {
      statusCounts[task.taskStatus] = (statusCounts[task.taskStatus] || 0) + 1;
    });
    return statusCounts;
  }

  loadTaskStatusCounts(){
    this.adminService.getTaskStatusCounts().subscribe((info)=>{
      this.setPieChartData(info);
      this.setBarChartData(info);
    });
  }

  loadOverdueTaskCount() {
    this.adminService.getOverdueTaskCount().subscribe((count) => {
      console.log('Overdue Task Count:', count); // Optional: For debugging
      this.overdueTaskCount = count;
    });
  }

  setPieChartData(statusCounts: { [status: string]: number }) {
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    
    this.pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }
      ]
    };
  }

  setBarChartData(statusCounts: { [status: string]: number }) {
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Tasks by Status',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }
      ]
    };
  }


}


