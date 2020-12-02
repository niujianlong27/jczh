import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  tplModal: NzModalRef;

  constructor(private http: HttpClient, private nm: NzModalService) { }
  dateNow() {
    const xhr = new XMLHttpRequest();
    let result: any = { sysTime1: '', sysTime2: '' };
    xhr.open('GET', 'http://quan.suning.com/getSysTime.do', false);
    xhr.send(null);

    if (xhr.status === 200 || xhr.status === 0) {
      result = JSON.parse(xhr.responseText);
    }
    return result;
  }

  /**
   * 判断数据可否进行当前操作
   * @param list为选中数据
   * @param option表示需判断的字段
   * @param statusArr为需要判断的状态
   * @param tipInfo为提示信息
   */
  canOperate(list: Array<any>, option: string, statusArr: Array<any>, tipInfo: string): boolean {
    let flag = false;
    list.forEach((item) => {
      if (statusArr.indexOf(item[option]) >= 0) {
        flag = true;
      }
    });
    if (flag) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: tipInfo
      });
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag;
  }

  /**
   * 创建弹框
   * @param type string 弹框类型：success,warning,info,error
   * @param content string 弹框内容
   */
  createTplModal(type: string, content: string, okFun?: Function): void {
    this.tplModal = this.nm[type]({
      nzTitle: '提示信息',
      nzContent: content,
      nzOnOk: () => {
        if (okFun) {
          okFun();
        }
      }
    });
    if (!okFun) {
      this.destroyTplModal();
    }
  }

  /**
   * 销毁弹框
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }
}
