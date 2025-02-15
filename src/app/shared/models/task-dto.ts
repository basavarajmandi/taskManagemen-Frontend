export enum TaskStatus { 

   PENDING,

    INPROGRESS,

    COMPLETED,

    DEFERRED,

    CANCELLED  
} 

export interface TaskDTO {
imageUrl: any;
id:number;
title:string;
dueDate:string;
description:string;
priority:string;
employeeId:number;
employeeName:string;
taskStatus:TaskStatus; 
categoryId: number;   // Add categoryId
categoryName: string; // Add categoryName
assignedDate: string; // Ensure this field exists in your backend response


}


