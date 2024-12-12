import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';


const BASE_URL="http://localhost:8080/";
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient :HttpClient) { }

 getUsers(): Observable<any>{
return this.httpClient.get(BASE_URL+"api/admin/users",{
headers:this.createAuthorizationHeader()
})
 }

postTask(taskDto: any):Observable<any>{
return this.httpClient.post(BASE_URL+"api/admin/savetask",taskDto,{
  headers:this.createAuthorizationHeader()
});
}

getAllTask():Observable<any>{
  return this.httpClient.get(BASE_URL+"api/admin/tasks",{
    headers:this.createAuthorizationHeader()
  })
}


deleteTask(id:number):Observable<any>{
  return this.httpClient.delete(BASE_URL+`api/admin/task/${id}`,{
    headers:this.createAuthorizationHeader()
  })
}

getTaskById(id:number):Observable<any>{
  return this.httpClient.get(BASE_URL+`api/admin/task/${id}`,{
    headers:this.createAuthorizationHeader()
  })

}
 private createAuthorizationHeader(): HttpHeaders {
  return new HttpHeaders().set(
    'Authorization', 'Bearer ' + StorageService.getToken())
}

updateTask(id:number,taskDto: any):Observable<any>{
  return this.httpClient.put(BASE_URL+`api/admin/task/${id}`,taskDto,{
    headers: this.createAuthorizationHeader()
  })
}

searchTask(title:string):Observable<any>{
  return this.httpClient.get(BASE_URL+`api/admin/task/search/${title}`,{
    headers:this.createAuthorizationHeader()
  })

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


}
