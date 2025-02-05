export enum TaskStatus { 

   PENDING,

    INPROGRESS,

    COMPLETED,

    DEFERRED,

    CANCELLED  
} 

export interface TaskDTO {
id:number;
title:string;
dueDate:string;
description:string;
priority:string;
employeeId:number;
employeeName:string;
taskStatus:TaskStatus; //use enum type here
}

