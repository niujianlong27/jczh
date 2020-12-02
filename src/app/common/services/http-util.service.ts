/**  封装http,对http请求做统一处理 **/
import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse , HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { timeout } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpUtilService {
  constructor(private http: HttpClient) { }
  /* 统一发送请求 */
  public request(params: any): any {
    if (params['method'] === 'post' || params['method'] === 'POST') {
      return this.post(params['url'], params['data'], params['options'], params['timeout']); // post请求
    } else {
      return this.get(params['url'], params['options'], params['timeout']); // get请求
    }
  }

  /** get请求 url接口地址 params参数*/
  public get(url: string, options?: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }, times: number = 300000): Promise<any> {
    return this.http.get(url, options = {}).pipe(timeout(times))
       .toPromise()
       .then(this.handleSuccess.bind(this))
       .catch(res => this.handleError(res));
  }
  /** post请求*/
  public post(url: string, params: any,  options?: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }, times: number = 3000000): Promise<any> {
      return this.http.post(url, params, options = {}).pipe(timeout(times))
        .toPromise()
        .then(this.handleSuccess.bind(this))
        .catch(res => this.handleError(res));
  }
  /** 成功情况下*/
  private handleSuccess(res: HttpResponse<any>) {
    if (!res) {
      return {
        success: false,
        data: null
      };
    }
     if (res['code'] === 100 || res['code'] === 120) { // 后台返回100 成功,120初始密码修改
       return {
          data: res,
          success: true
       };
     } else {
        return {
          data: res,
          success: false
        };

     }
  }
  private handleError(res: HttpErrorResponse) {
    return res.status !== 200 ? {
      success: false,
      data: {
        message: res && res.message
      },
      msg: '请求失败'
    } : {
      success: true,
      data: res
    };
  }
}
