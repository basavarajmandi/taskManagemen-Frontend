import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { PaginatedResponse } from 'src/app/shared/models/paginated-response';
import { TaskDTO } from 'src/app/shared/models/task-dto';

// const BASE_URL="http://localhost:8080/";
const BASE_URL="http://task-management-app-env.eba-xp9q7my3.eu-north-1.elasticbeanstalk.com/"; // forProduction from elasticbeanstalk 

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private httpClient :HttpClient) {
  }
  
  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
       'Bearer ' + StorageService.getToken())
  }

  private createAuthorizationHeaderWithoutJSON(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + StorageService.getToken()
    ); // No 'Content-Type' for FormDa
  }
  
 getUsers(): Observable<any>{
return this.httpClient.get(BASE_URL+"api/admin/users",{
headers:this.createAuthorizationHeader()
})
 }

 getAllTask():Observable<TaskDTO[]>{
  return this.httpClient.get<TaskDTO[]> (BASE_URL+"api/admin/tasks",{
    headers:this.createAuthorizationHeader()
  })
}

getTaskById(id: number): Observable<any> {
  return this.httpClient.get(BASE_URL + `api/admin/task/${id}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map((task: any) => {

      if (task.imageName && !task.imageName.startsWith('http')) {
        task.imageName = `${BASE_URL}api/files/images/${task.imageName}`; }
      if(task.voiceName && !task.voiceName.startsWith('http')){
        task.voiceName= `${BASE_URL}api/files/voice/${task.voiceName}`;
      }
      return task;
    })
  );
}

postTask(taskData: any, file?: File, voiceFile?: File  ): Observable<any> {
  const formData = new FormData();
  Object.keys(taskData).forEach(key => {
    if (taskData[key] !== null) {
      formData.append(key, taskData[key]);
    }
  });

  if (file) {
    formData.append('image', file);
  }
  if (voiceFile) {
    formData.append('voice', voiceFile);
  }

  return this.httpClient.post(BASE_URL + "api/admin/savetask", formData, {
    headers: this.createAuthorizationHeaderWithoutJSON(),
  });
}

updateTask(id: number, taskDto: any, image?: File,voice?: File): Observable<any> {
  const formData = new FormData();

  // Convert taskDto to a JSON string and append to FormData
  formData.append('taskDto', new Blob([JSON.stringify(taskDto)], { type: 'application/json' }));

  // Append image if provided
  if (image) {
    formData.append('image', image);
  }
  // Append voice file if provided
  if (voice) {
    formData.append('voice', voice);
  }
  return this.httpClient.put(BASE_URL + `api/admin/task/${id}`, formData, {
    headers: this.createAuthorizationHeaderWithoutJSON(), // No 'Content-Type' for FormData
  });
}
getCategories(): Observable<any> {
  return this.httpClient.get(BASE_URL + "api/admin/categories", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksDueToday(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/today", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksDueYesterday(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/yesterday", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksThisWeek(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/this-week", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksLastWeek(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/last-week", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksThisMonth(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/this-month", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksLastMonth(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/last-month", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksThisYear(): Observable<TaskDTO[]> {
  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/this-year", {
    headers: this.createAuthorizationHeader(),
  });
}

getTasksByCustomRange(startDate: Date, endDate: Date): Observable<TaskDTO[]> {
  const params = new HttpParams()
    .set('startDate', startDate.toISOString().split('T')[0])
    .set('endDate', endDate.toISOString().split('T')[0]);

  return this.httpClient.get<TaskDTO[]>(BASE_URL + "api/admin/tasks/custom", {
    headers: this.createAuthorizationHeader(),
    params: params
  });
}

getAllTaskWithPagination(params: any): Observable<PaginatedResponse> {
  let httpParams = new HttpParams()
    .set('page', params.page)
    .set('size', params.size)
    .set('sortField', params.sort)
    .set('direction', params.direction);

  return this.httpClient.get<PaginatedResponse>(BASE_URL + 'api/admin/tasks/paginated',{
      params: httpParams,
      headers: this.createAuthorizationHeader(),
    }
  );
}

deleteTask(id:number):Observable<any>{
  return this.httpClient.delete(BASE_URL+`api/admin/task/${id}`,{
    headers:this.createAuthorizationHeader()
  })
}

searchTask(title:string):Observable<any>{
  return this.httpClient.get(BASE_URL+`api/admin/task/search/${title}`,{
    headers:this.createAuthorizationHeader()
  })
}

searchTaskByPriority(priority:string):Observable<any>{
  return this.httpClient.get(BASE_URL+ `api/admin/task/search/${priority}`,{
    headers:this.createAuthorizationHeader()
  });
}
createComment(id:number, content:string):Observable<any>{
  const params={
    taskId:id,
    postedBy:StorageService.getUserId()
  }
  return this.httpClient.post(BASE_URL + `api/admin/task/comment`,content,{
    params :params,
    headers: this.createAuthorizationHeader()
  });
}

getCommentsByTaskId(id:number):Observable<any>{
  return this.httpClient.get(BASE_URL+`api/admin/task/${id}/comments`,{
    headers: this.createAuthorizationHeader()
  }
  )
}

// filterTasks(priority?: string[] | string, title?:string, dueDate?:string,taskStatus?: string[] | string,employeeName?:string,categoryNames?: string[]):Observable<any> {
//   let params:any={};

//   if (priority) params['priority'] = Array.isArray(priority) ? priority.join(',') : priority;
//   if(title) params['title']=title;
//   if(dueDate) params['dueDate']=dueDate;
//   if (taskStatus) params['taskStatus'] = Array.isArray(taskStatus) ? taskStatus.join(',') : taskStatus;
//   if(employeeName) params['employeeName']=employeeName;
//   if (categoryNames) params['categoryNames'] = categoryNames.join(',');
//   return this.httpClient.get(BASE_URL + 'api/admin/tasks/filter',{
//     params:params,
//     headers:this.createAuthorizationHeader()
//   });
// }

filterTasks(priority?: string[], title?: string, dueDate?: string, taskStatus?: string[], employeeName?: string, categoryNames?: string[]): Observable<any> {
  let params: any = {};

  if (priority) params['priority'] = priority; 
  if (title) params['title'] = title;
  if (dueDate) params['dueDate'] = dueDate;
  if (taskStatus) params['taskStatus'] = taskStatus;  
  if (employeeName) params['employeeName'] = employeeName;
  if (categoryNames) params['categoryNames'] = categoryNames;

  return this.httpClient.get(BASE_URL + 'api/admin/tasks/filter', {
    params: params,
    headers: this.createAuthorizationHeader()
  });
}


getAllCategories(): Observable<string[]> {
  return this.httpClient.get<string[]>(BASE_URL + 'api/admin/filter/categories', {
    headers: this.createAuthorizationHeader(),
  });
}

getOverdueTaskCount(): Observable<number> {
  return this.httpClient.get<number>(BASE_URL + 'api/admin/tasks/overdue', {
    headers: this.createAuthorizationHeader()
  });
}

getTaskStatusCounts():Observable<Record<string,number>>{

  return this.httpClient.get<Record<string,number>>(BASE_URL+'api/admin/tasks/status-counts',{
    headers:this.createAuthorizationHeader(),
  });
}

getTaskCountByStatus(status:string):Observable<number>{
  return this.httpClient.get<number>(`${BASE_URL}/api/admin/tasks/{status}`);
}

getAllOverdueTask():Observable<TaskDTO[]>{
  return this.httpClient.get<TaskDTO[]>(BASE_URL+'api/admin/task/alloverdue',{
    headers:this.createAuthorizationHeader()
  })
}

getTaskCountsByPriotity():Observable<any>{
  return this.httpClient.get(BASE_URL+ 'api/admin/tasks/priority-counts',{
    headers:this.createAuthorizationHeader(),
  });
}

exportToExcel(): Observable<Blob> {
  return this.httpClient.get(BASE_URL + 'api/admin/tasks/export', {
    headers: this.createAuthorizationHeader(),
    responseType: 'blob', // Important for handling file downloads
  });
}

}
// postTask(taskDto: any):Observable<any>{
// return this.httpClient.post(BASE_URL+"api/admin/savetask",taskDto,{
//   headers:this.createAuthorizationHeader()
// });
// }

// getTaskById(id:number):Observable<any>{
//   return this.httpClient.get(BASE_URL+`api/admin/task/${id}`,{
//     headers:this.createAuthorizationHeader()
//   })
// }

// getAllTaskwithtable(): Observable<TaskDTO[]> {
//   return this.httpClient.get<TaskDTO[]>(BASE_URL + 'api/admin/tasks', {
//     headers:this.createAuthorizationHeader()
//   });
// }



// updateTask(id: number, formData: FormData): Observable<any> {
//   return this.httpClient.put(BASE_URL + `api/admin/task/${id}`, formData, {
//     headers: this.createAuthorizationHeaderWithoutJSON(), // Do not set 'Content-Type', Angular will handle it
//   });
// }