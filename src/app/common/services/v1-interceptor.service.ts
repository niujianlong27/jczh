import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '@model/url';
import {tap} from 'rxjs/operators';

@Injectable()
export class V1InterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 清除请求头中的source
    if (req.url === urls.loginV1) {
      const newReq = req.clone({
        headers: req.headers.delete('source')
      });
      return next.handle(newReq);
    }
    return next.handle(req);
  }

}
