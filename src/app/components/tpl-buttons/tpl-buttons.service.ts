import { Injectable, EventEmitter } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})

export class TplButtonsService {
   public btnFind: EventEmitter<any>;//
   public formSearch: EventEmitter<any>;
   public formReset: EventEmitter<any>;
   public collaspedSearch: EventEmitter<any>;
   constructor() {
      this.btnFind = new EventEmitter();
      this.formSearch = new EventEmitter();
      this.formReset = new EventEmitter();
      this.collaspedSearch = new EventEmitter();
   }
}