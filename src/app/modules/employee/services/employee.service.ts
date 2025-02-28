import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

const BASE_URL="http://localhost:8080/";
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient :HttpClient) { 
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + StorageService.getToken())
  }


  getFilteredTasksByUserId(
    title?: string,
    priorities?: string[],
    taskStatuses?: string[],
    dueDate?: string,
    categoryNames?: string[], // <-- Added categoryNames parameter
  ): Observable<any> {
    let params = new HttpParams();
    if (title) params = params.append('title', title);
    if (priorities) priorities.forEach(priority => params = params.append('priorities', priority));
    if (taskStatuses) taskStatuses.forEach(status => params = params.append('taskStatuses', status));
    if (categoryNames) categoryNames.forEach(category => params = params.append('categoryNames', category)); // <-- Append categories
    if (dueDate) params = params.append('dueDate', dueDate);
    return this.httpClient.get(BASE_URL + `api/employee/tasks/user/${StorageService.getUserId()}`, {
      headers: this.createAuthorizationHeader(),
      params: params
    });
  }
  
  getAllCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(BASE_URL + 'api/employee/filter/categories', {
      headers: this.createAuthorizationHeader(),
    });
  }
  
  getTaskById(id:number):Observable<any>{
    return this.httpClient.get(BASE_URL+`api/employee/task/${id}`,{
      headers:this.createAuthorizationHeader()
    })
  }

  updateTask(id:number,status:string):Observable<any>{
    return this.httpClient.put(BASE_URL+`api/employee/task/${id}/${status}`,{},{
      headers:this.createAuthorizationHeader()
    });
  }

  createComment(formData: FormData): Observable<any> {
    return this.httpClient.post(BASE_URL + `api/employee/task/comment`, formData, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCommentsByTaskId(id:number):Observable<any>{
     return this.httpClient.get(BASE_URL+`api/employee/task/${id}/comments`,{
      headers: this.createAuthorizationHeader()
    })
  }

  // Fetch the employee's dashboard data
  getEmployeeTaskStatus(employeeId: number): Observable<any> {
    return this.httpClient.get(`${BASE_URL}api/employee/dashboard?employeeId=${employeeId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getTaskCountsByPriority(employeeId:number):Observable<any>{
    return this.httpClient.get(`${BASE_URL}api/employee/${employeeId}/task-counts-by-priority`,{
      headers: this.createAuthorizationHeader()
    });
  }

}
  // createComment(id:number, content:string):Observable<any>{
  //   const params={
  //     taskId:id,
  //     postedBy:StorageService.getUserId()
  //   }
  //   return this.httpClient.post(BASE_URL + `api/employee/task/comment`,content,{
  //     params :params,
  //     headers: this.createAuthorizationHeader()
  //   });
  // }

  //   getTaskByUserId(title: string, taskStatus: string[], priority: string[], dueDate: string): Observable<any> {
//     return this.httpClient.get(BASE_URL + `api/employee/task/user/${StorageService.getUserId()}`, {
//         params: {
//             title: title || '',
//             taskStatus: taskStatus.join(',') || '', // Convert array to comma-separated string
//             priority: priority.join(',') || '',
//             dueDate: dueDate || ''
//         },
//         headers: this.createAuthorizationHeader()
//     });
// }