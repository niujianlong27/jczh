import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private keys: Set<string> = new Set<string>();
  private store: Map<string, any> = new Map<string, any>();
  constructor() { }
  /**
   * SessionStorge存储
   *  */
  setSession(key: string, data: any): boolean{
     sessionStorage.setItem(key, JSON.stringify(data));
     return true;
  }
  getSession(key: string): any {
     return JSON.parse(sessionStorage.getItem(key) || 'null');
  }
  clearSession(key: string): boolean {
    sessionStorage.removeItem(key);
    return true;
  }
  clearAllSession(): boolean {
    sessionStorage.clear();
    return true;
  }

  /**
   * localStorage存储
  */
 setLocal(key: string, data: any): boolean {
   localStorage.setItem(key, JSON.stringify(data));
   return true;
 }
 getLocal(key: string): any {
   return JSON.parse(localStorage.getItem(key) || 'null');
 }
 clearLocal(key: string): boolean {
   localStorage.removeItem(key);
   return true;
 }
 clearAllLocal(): boolean {
   localStorage.clear();
   return true;
 }
 /**
  * 存储
  *  */
   set(key: string, data: any): boolean { // 先删在改
     if (this.has(key)) {
        throw new Error('key is exist!');
     }
      this.keys.add(key);
      this.store.set(key, data);
      return true;
   }
   get(key: string): any {
     return this.store.get(key);
   }
   remove(key: string): boolean {
      this.keys.delete(key);
      this.store.delete(key);
      return true;
   }
   clear() {
     this.keys.clear();
     this.store.clear();
   }
   private has(key: string) {
     return this.keys.has(key) || this.store.has(key);
   }
}
