import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { trigger, state, style, transition, animate } from '@angular/animations';
// Register the plugin
Chart.register(ChartDataLabels);
// Use Chart.register()

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('void', style({ transform: 'translateX(100%)' })),  // Initial position off-screen to the right
      transition(':enter', [
        animate('0.5s ease-out')  // Slide in from right over 0.5 seconds
      ])
    ])
  ]

})
export class MainDashboardComponent {

  doughnutChartData: any;
  doughnutChartLabels: string[] = [];
  doughnutChartCounts: number[] = [];
  doughnutChartColors: any;
  doughnutChartOptions: any;

  animationState: string = '';

  public TotalTaskCount: number = 0;
  public OverdueTaskCount: number = 0; // Declare and initialize
  public CompletedTaskCount: number = 0;
  public PendingTaskCount: number = 0;
  public InprogressTaskCount: number = 0;
  public CancelledTaskCount: number = 0;

  public barChartData: ChartData<'bar'> | undefined;
  public pieChartData: ChartData<'pie'> | undefined;
  constructor(private adminService: AdminService) { }


  ngOnInit(): void {
    this.loadTaskStatusCounts();
    this.loadOverdueTaskCount();
    this.loadChartData();
    this.configureChartOptions();
    this.animationState = 'in';

  }
  loadChartData(): void {
    const projectData = this.adminService.getProjectsByPriority();
    this.doughnutChartLabels = projectData.map((item) => item.priority);
    this.doughnutChartCounts = projectData.map((item) => item.count);
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: this.doughnutChartCounts,
          backgroundColor: ['#3DB1C4', '#4BC0C0', '#F7B633', '#7F8C8D', '#FF6384'],
        },
      ],
    };
  }


  groupTasksByStatus(tasks: any[]): { [status: string]: number } {
    const statusCounts: { [status: string]: number } = {};
    tasks.forEach((task) => {
      statusCounts[task.taskStatus] = (statusCounts[task.taskStatus] || 0) + 1;
    });
    return statusCounts;
  }

  loadTaskStatusCounts(): void {
    // Fetch task status counts (Completed & Pending)
    this.adminService.getTaskStatusCounts().subscribe((counts) => {
      this.CompletedTaskCount = counts['COMPLETED'] || 0;
      this.PendingTaskCount = counts['PENDING'] || 0;
      this.InprogressTaskCount = counts['INPROGRESS'] || 0;
      this.CancelledTaskCount = counts['CANCELLED'] || 0;
      this.setBarChartData(counts);
      this.setPieChartData(counts);
      // Calculate total tasks by summing up counts
      this.TotalTaskCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    });
  }

  loadOverdueTaskCount() {
    this.adminService.getOverdueTaskCount().subscribe((count) => {
      console.log('Overdue Task Count:', count); // Optional: For debugging
      this.OverdueTaskCount = count;
    });
  }

  configureChartOptions(): void {
    this.doughnutChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: (context: any) =>
              `${context.label}: ${context.raw} (${(
                (context.raw / this.doughnutChartCounts.reduce((a, b) => a + b, 0)) *
                100
              ).toFixed(2)}%)`,
          },
        },
      },
    };
  }

  public barchartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Projects by Status'
      },
      datalabels: {
        anchor: 'end', // Position the label above the bar
        align: 'end', // Align the label to the top
        color: '#000', // Set label color
        formatter: (value) => value, // Display the value as is
        font: {
          size: 10, // Set font size
          weight: 'bold',
        },
    },
  },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis gridlines
        },
      },
      y: {
        display: false, // Hide y-axis
      },
    },
  };
  setBarChartData(statusCounts: { [month: string]: number }) {
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Tasks by Month',
          data,
          backgroundColor: '#36A2EB', // A single color for the bars
          borderColor: '#1F77B4', // Bar border color
          borderWidth: 2
        }
      ]
    };
  }


  public piechartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'Task Status Overview '
      }
    }
  };

  setPieChartData(statusCounts: { [status: string]: number }) {
    const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0); // Calculate total tasks
    const percentages = Object.values(statusCounts).map((count) => ((count / totalTasks) * 100).toFixed(2)); // Calculate percentages
    const labels = Object.keys(statusCounts).map((status, index) => `${status}: ${percentages[index]}%`); // Append percentage to labels

    this.pieChartData = {
      labels, // Updated labels with percentages
      datasets: [
        {
          data: Object.values(statusCounts), // Use original task counts for the chart
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Custom colors
        }
      ]
    };
  }



}


