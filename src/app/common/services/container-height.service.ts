import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContainerHeightService {
  public currentSearchHeight: EventEmitter<any>;
  public primarySearchHeight: EventEmitter<any>;
  public primaryButtonHeight: EventEmitter<any>;
  constructor() {
    this.currentSearchHeight = new EventEmitter<any>();
    this.primarySearchHeight = new EventEmitter<any>();
    this.primaryButtonHeight = new EventEmitter<any>();
   }
}
