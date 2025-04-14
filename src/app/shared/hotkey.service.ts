import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {

  private openAddLinkSubject = new Subject<void>();
  openAddLink$ = this.openAddLinkSubject.asObservable();

  private openImageSubject = new Subject<void>();
  openImage$ = this.openImageSubject.asObservable();

  private openMicStartSubject = new Subject<void>();
  openMicStart$ = this.openMicStartSubject.asObservable();

  private openMicStopSubject = new Subject<void>();
  openMicStop$ = this.openMicStopSubject.asObservable();

  private focusDueDateSubject = new Subject<void>();
  focusDueDate$ = this.focusDueDateSubject.asObservable();

  private focusCategoryDialogSubject = new Subject<void>();
  focusCategoryDialog$ = this.focusCategoryDialogSubject.asObservable();

  private openLocationSubject =new Subject<void>();
  openLocation$ =this.openLocationSubject.asObservable();


  constructor() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'k':
            event.preventDefault();
            this.openAddLinkSubject.next();
            break;
          case 'i':
            event.preventDefault();
            this.openImageSubject.next();
            break;
          case 'm':
            event.preventDefault();
            this.openMicStartSubject.next();
            break;
          case 's':
            event.preventDefault();
            this.openMicStopSubject.next();
            break;
          case 'd':
            event.preventDefault();
            this.focusDueDateSubject.next();
            break;

          case 'c': // Ctrl + T for Tag
          if(event.shiftKey){
            event.preventDefault();
            this.focusCategoryDialogSubject.next(); // You can name this anything
          }
            break;

           case 'l':
            event.preventDefault();
            this.openLocationSubject.next();
            break;
        }
       
      }
    });
  }
}

