import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
// Register the plugin
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-employemini-dashboard',
  templateUrl: './employemini-dashboard.component.html',
  styleUrls: ['./employemini-dashboard.component.scss'],
   animations: [
      trigger('slideInFromRight', [
        state('void', style({ transform: 'translateX(100%)' })),  // Initial position off-screen to the right
        transition(':enter', [
          animate('0.5s ease-out')  // Slide in from right over 0.5 seconds
        ])
      ])
    ]
})
export class EmployeminiDashboardComponent {
  animationState: string = '';
  public TotalTaskCount: number = 0;
  //public OverdueTaskCount: number = 0; // Declare and initialize
  public CompletedTaskCount: number = 0;
  public PendingTaskCount: number = 0;
  public InprogressTaskCount: number = 0;
  public CancelledTaskCount: number = 0;
// Doughnut Chart Data for Task Priority
public doughnutChartData: ChartData<'doughnut'> = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['#49d4eb', '#4BC0C0', '#F7B633', '#7F8C8D', '#FF6384', '#d465f0'], // Custom colors
    },
  ],
};

doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    tooltip: {
      callbacks: {
        label: (context: any) =>
          `${context.label}: ${context.raw} (${(
            (context.raw /
              this.doughnutChartData.datasets[0].data.reduce((a, b) => a + b, 0)) *
            100
          ).toFixed(2)}%)`,
      },
    },
  },
};


  public pieChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Custom colors
      },
    ],
  };

  public piechartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Task Status Overview',
      },
    },
  };
  
  constructor(private employeService: EmployeeService){}

  ngOnInit():void{
this.loadTaskStatusCounts();
this.loadTaskCountsByPriority();
  }

  loadTaskStatusCounts():void{

    const employeeId =StorageService.getUserId();
     if(employeeId){

    this.employeService.getEmployeeTaskStatus(Number(employeeId)).subscribe((data:any)=>{
      this.TotalTaskCount=data.totalTasks;
      this.CompletedTaskCount=data.completedTasks;
      this.PendingTaskCount=data.pendingTasks;
      this.InprogressTaskCount=data.inProgressTasks;
      this.CancelledTaskCount=data.cancelledTasks;
      this.setPieChartData(data);
    },
  error =>{
    console.error('error fetching employee dashboard data', error);
  }
);
  }
  }
  setDoughnutChartData(priorityCounts: { [priority: string]: number }): void {
    this.doughnutChartData = {
      labels: Object.keys(priorityCounts), // Use the priorities as labels
      datasets: [
        {
          data: Object.values(priorityCounts), // Use the task counts for the doughnut chart
          backgroundColor: ['#49d4eb', '#4BC0C0', '#F7B633', '#7F8C8D', '#FF6384', '#d465f0'], // Custom colors
        },
      ],
    };
  }

  loadTaskCountsByPriority(): void {
    const employeeId = StorageService.getUserId();
    if (employeeId) {
      this.employeService.getTaskCountsByPriority(Number(employeeId)).subscribe(
        (data: any) => {
          this.setDoughnutChartData(data);
        },
        (error) => {
          console.error('Error fetching task counts by priority:', error);
        }
      );
    }
  }

  setPieChartData(statusCounts: { [status: string]: number }): void {
    const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0); // Calculate total tasks
    const percentages = Object.values(statusCounts).map(
      (count) => ((count / totalTasks) * 100).toFixed(2)
    ); // Calculate percentages
    const labels = Object.keys(statusCounts).map(
      (status, index) => `${status}: ${percentages[index]}%` // Append percentage to labels
    );

    this.pieChartData = {
      labels, // Updated labels with percentages
      datasets: [
        {
          data: Object.values(statusCounts), // Use original task counts for the chart
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Custom colors
        },
      ],
    };
  }
}
