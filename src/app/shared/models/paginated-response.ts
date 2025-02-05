import { TaskDTO } from "./task-dto";

export interface PaginatedResponse {

    content: TaskDTO[];      // List of tasks in the current page
    totalElements: number;    // Total number of tasks available (across all pages)
    totalPages: number;       // Total number of pages available
    size: number;             // Number of items per page
    page: number;             // Current page index (0-based)
    sort: any;  
}
