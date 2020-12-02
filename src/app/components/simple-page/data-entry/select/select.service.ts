import { Injectable } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { of } from 'rxjs';
@Injectable()
export class SelectService {

  constructor(private http: HttpUtilService) { }

  getValue(url: string, param: any): Promise<any> {
    // return of({data: [{label: "label1", value: "value1"},{label: "label2", value: "value2"},{label: "label3", value: "value3"}]}).toPromise()
    // 如果未指定分页信息，则默认查询一万条
    if(!param.page || !param.length){
      param.page = 1;
      param.length = 10000;
    }
    return this.http.post(url, param);
  }
}

